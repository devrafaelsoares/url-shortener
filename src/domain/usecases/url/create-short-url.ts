import { Url, UrlPropsCreate } from "@domain/entities";
import { UrlMapper } from "@domain/mappers";
import { IdProvider, ToBaseProvider, SafeBrowsingProvider } from "@domain/protocols/providers";
import { UrlRepository, UserRepository } from "@domain/protocols/repositories";
import { ValidationError, Validator } from "@domain/protocols/validators";
import { Either, error, success } from "@/helpers";
import { UrlShortenerToBase } from "@infra/providers/url-shortener";
import { CreateUrlRequestUseCaseProps, UrlResponseProps } from "@presentation/adpaters";
import { ErrorMessages, ExistsEntityError, NotFoundEntityError, UnauthorizedEntityError, BadRequestEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";

type CreateShortUrlUseCaseProps = {
    readonly idProvider: IdProvider;
    readonly toBaseProvider: ToBaseProvider;
    readonly idProviderUrlShortener: IdProvider;
    readonly urlValidator: Validator<UrlPropsCreate>;
    readonly urlRepository: UrlRepository;
    readonly userRepository: UserRepository;
    readonly safeBrowsingProvider: SafeBrowsingProvider;
};

export class CreateShortUrlUseCase {
    constructor(private props: CreateShortUrlUseCaseProps) {}

    async execute({
        original_url,
        authenticatedUserId,
    }: CreateUrlRequestUseCaseProps): Promise<
        Either<
            ValidationError<UrlPropsCreate>[] | ExistsEntityError | UnauthorizedEntityError | NotFoundEntityError | BadRequestEntityError,
            UrlResponseProps
        >
    > {
        if (!authenticatedUserId) {
            return error(new UnauthorizedEntityError(ErrorMessages.ACCESS_DENIED, HttpStatus.UNAUTHORIZED));
        }

        const isSafe = await this.props.safeBrowsingProvider.isSafe(original_url);
        if (!isSafe) {
            return error(new BadRequestEntityError("A URL fornecida foi identificada como maliciosa ou não segura.", HttpStatus.BAD_REQUEST));
        }

        const foundUser = await this.props.userRepository.findById(authenticatedUserId);

        if (!foundUser) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_USER, HttpStatus.NOT_FOUND));
        }

        const urlProps: UrlPropsCreate = {
            originalUrl: original_url,
            userId: foundUser.id,
            user: foundUser,
        };

        const urlResult = Url.create({
            props: urlProps,
            providers: {
                idProvider: this.props.idProvider,
                urlShortenerProvider: new UrlShortenerToBase(
                    this.props.toBaseProvider,
                    this.props.idProviderUrlShortener
                ),
            },
            validator: this.props.urlValidator,
        });

        if (urlResult.isError()) {
            return error(urlResult.value);
        }

        const url = urlResult.value;

        try {
            const createdUrl = await this.props.urlRepository.create(url);
            return success(UrlMapper.toHttpResponse(createdUrl));
        } catch (errorObj: any) {
            // AppSec & Infra: Eliminamos o Anti-Pattern "Check-Then-Act" (SELECT -> INSERT)
            // Agora confiamos no Unique Constraint do Banco (Race Condition mitigated)
            // Se houver colisão de Hash, o banco grita e mapeamos o erro de forma segura.
            if (errorObj?.name === "SequelizeUniqueConstraintError" || errorObj?.message?.includes("unique")) {
                return error(new ExistsEntityError(ErrorMessages.EXISTS_URL, HttpStatus.CONFLIT));
            }
            throw errorObj;
        }
    }
}
