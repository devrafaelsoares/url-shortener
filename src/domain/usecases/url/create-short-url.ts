import { Url, UrlPropsCreate } from "@domain/entities";
import { UrlMapper } from "@domain/mappers";
import { IdProvider, ToBaseProvider } from "@domain/protocols/providers";
import { UrlRepository, UserRepository } from "@domain/protocols/repositories";
import { ValidationError, Validator } from "@domain/protocols/validators";
import { Either, error, success } from "@/helpers";
import { UrlShortenerToBase } from "@infra/providers/url-shortener";
import { CreateUrlRequestUseCaseProps, UrlResponseProps } from "@presentation/adpaters";
import { ErrorMessages, ExistsEntityError, NotFoundEntityError, UnauthorizedEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { PayloadUserProps } from "@presentation/adpaters/user";
import { JwtToken } from "@infra/providers/token";
import env from "@env";

type CreateShortUrlUseCaseProps = {
    readonly idProvider: IdProvider;
    readonly toBaseProvider: ToBaseProvider;
    readonly idProviderUrlShortener: IdProvider;
    readonly urlValidator: Validator<UrlPropsCreate>;
    readonly urlRepository: UrlRepository;
    readonly userRepository: UserRepository;
};

export class CreateShortUrlUseCase {
    constructor(private props: CreateShortUrlUseCaseProps) {}

    async execute({
        original_url,
        token,
    }: CreateUrlRequestUseCaseProps): Promise<
        Either<
            ValidationError<UrlPropsCreate>[] | ExistsEntityError | UnauthorizedEntityError | NotFoundEntityError,
            UrlResponseProps
        >
    > {
        if (!token) {
            return error(new UnauthorizedEntityError(ErrorMessages.ACCESS_DENIED, HttpStatus.UNAUTHORIZED));
        }

        const { payload } = new JwtToken<PayloadUserProps>({ secret: env.SECRET_KEY_AUTH, token });

        if (!payload) {
            return error(new UnauthorizedEntityError(ErrorMessages.ACCESS_DENIED, HttpStatus.UNAUTHORIZED));
        }

        const foundUser = await this.props.userRepository.findById(payload.id);

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

        const foundUrl = await this.props.urlRepository.findByShortUrl(url.shortUrl);

        if (foundUrl) {
            return error(new ExistsEntityError(ErrorMessages.EXISTS_URL, HttpStatus.CONFLIT));
        }

        const createdUrl = await this.props.urlRepository.create(url);

        return success(UrlMapper.toHttpResponse(createdUrl));
    }
}
