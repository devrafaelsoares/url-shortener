import { UrlMapper } from "@domain/mappers";
import { UrlRepository } from "@domain/protocols/repositories";
import { Either, error, success } from "@/helpers";
import { FindShortUrlRequestProps, UrlResponseProps } from "@presentation/adpaters";
import { ErrorMessages, NotFoundEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { UrlLogPropsCreate } from "@domain/entities";
import { ValidationError } from "@domain/protocols/validators";

type FindShortUrlUseCaseProps = {
    readonly urlRepository: UrlRepository;
};

export class FindShortUrlUseCase {
    constructor(private props: FindShortUrlUseCaseProps) {}

    async execute({
        id,
    }: FindShortUrlRequestProps): Promise<
        Either<ValidationError<UrlLogPropsCreate>[] | NotFoundEntityError, UrlResponseProps>
    > {
        const foundUrl = await this.props.urlRepository.findById(id);

        if (!foundUrl) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_SHORT_URL, HttpStatus.NOT_FOUND));
        }

        return success(UrlMapper.toHttpResponse(foundUrl));
    }
}
