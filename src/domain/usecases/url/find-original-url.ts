import { UrlMapper } from "@domain/mappers";
import { UrlMemoryRepository, UrlLogRepository, UrlRepository } from "@domain/protocols/repositories";
import { Either, error, success } from "@/helpers";
import { FindOriginalUrlUseCaseRequestProps, UrlResponseProps } from "@presentation/adpaters";
import { ErrorMessages, NotFoundEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { UrlLog, UrlLogPropsCreate } from "@domain/entities";
import { IdProvider } from "@domain/protocols/providers";
import { ValidationError, Validator } from "@domain/protocols/validators";

type FindOriginalUrlUseCaseProps = {
    readonly urlRepository: UrlRepository;
    readonly urlMemoryRepository: UrlMemoryRepository;
    readonly urlLogRepository: UrlLogRepository;
    readonly idProvider: IdProvider;
    readonly urlLogValidator: Validator<UrlLogPropsCreate>;
};

export class FindOriginalUrlUseCase {
    constructor(private props: FindOriginalUrlUseCaseProps) {}

    async execute({
        short_url,
        ip_address,
        user_agent,
    }: FindOriginalUrlUseCaseRequestProps): Promise<
        Either<ValidationError<UrlLogPropsCreate>[] | NotFoundEntityError, UrlResponseProps>
    > {
        const foundUrl = await this.props.urlRepository.findByShortUrl(short_url);

        const currentDate = new Date();

        if (!foundUrl) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_SHORT_URL, HttpStatus.NOT_FOUND));
        }

        const isExpiredUrl = foundUrl.expiresAt && foundUrl.expiresAt.getTime() <= currentDate.getTime();

        if (isExpiredUrl) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_SHORT_URL, HttpStatus.NOT_FOUND));
        }

        const urlLogProps: UrlLogPropsCreate = {
            ipAddress: ip_address,
            userAgent: user_agent,
            accessedAt: currentDate,
            urlId: foundUrl.id,
        };

        const urlLogResult = UrlLog.create({
            props: urlLogProps,
            providers: { idProvider: this.props.idProvider },
            validator: this.props.urlLogValidator,
        });

        if (urlLogResult.isError()) {
            return error(urlLogResult.value);
        }

        const urlLog = urlLogResult.value;

        await this.props.urlMemoryRepository.incrementAccessCount(foundUrl.id);

        await this.props.urlRepository.incrementAccessCount(foundUrl.id);

        await this.props.urlLogRepository.create(urlLog);

        return success(UrlMapper.toHttpResponse(foundUrl));
    }
}
