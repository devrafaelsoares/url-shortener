import {
    HashingAlgorithm,
    SendEmail,
    User,
    UserProps,
    UserPropsCreate,
    VerificationToken,
    VerificationTokenTypes,
} from "@domain/entities";
import { IdProvider, PasswordProvider, TokenProvider } from "@domain/protocols/providers";
import { Either, error, success } from "@/helpers";
import { ErrorMessages, ExistsEntityError, NotFoundEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { UserRepository } from "@domain/protocols/repositories";
import { CreateUserRequestProps, UserCreateResponseProps } from "@presentation/adpaters/user";
import { ValidationError, Validator } from "@domain/protocols/validators";
import { UserMapper } from "@domain/mappers/user";
import { SendUserConfirmationEmailUseCase } from "@domain/usecases/email";

type RegisterUserUseCaseProps = {
    readonly userRepository: UserRepository;
    readonly userValidator: Validator<UserPropsCreate>;
    readonly passwordProvider: PasswordProvider;
    readonly idProvider: IdProvider;
    readonly tokenProvider: TokenProvider;
    readonly sendEmailUserEmailConfirmation: SendUserConfirmationEmailUseCase;
    readonly sendEmail: SendEmail;
};

export class RegisterUserUseCase {
    constructor(private props: RegisterUserUseCaseProps) {}

    async execute({
        email,
        name,
        password,
    }: CreateUserRequestProps): Promise<
        Either<ValidationError<UserProps>[] | ExistsEntityError, UserCreateResponseProps>
    > {
        const foundUser = await this.props.userRepository.findByEmail(email);

        if (foundUser) {
            return error(new ExistsEntityError(ErrorMessages.EXISTS_USER_EMAIL, HttpStatus.CONFLIT));
        }

        const hashingAlgorithm = await HashingAlgorithm.create({
            idProvider: this.props.idProvider,
            props: {
                name: this.props.passwordProvider.method,
            },
        });

        const userResult = await User.create({
            props: {
                name: name,
                email: email,
                hashingAlgorithm,
                password: password,
            },
            idProvider: this.props.idProvider,
            passwordProviderConfig: {
                provider: this.props.passwordProvider,
                salt: await this.props.passwordProvider.salt(),
            },
            validator: this.props.userValidator,
        });

        if (userResult.isError()) {
            return error(userResult.value);
        }

        const user = userResult.value;

        const { token, expiresAt } = this.props.tokenProvider.generate();

        const userEmailConfirmation = await VerificationToken.create({
            props: {
                token,
                expiresAt,
                type: VerificationTokenTypes.CONFIRMATION_EMAIL,
            },
            idProvider: this.props.idProvider,
            tokenProvider: this.props.tokenProvider,
        });

        user.addVerificationToken(userEmailConfirmation);

        const createdUser = await this.props.userRepository.create(user);

        if (this.props.sendEmail === SendEmail.TRUE) {
            const sendEmailInfo = await this.props.sendEmailUserEmailConfirmation.send(createdUser);
            if (sendEmailInfo.isError()) {
                const { message } = sendEmailInfo.value;
                return error(new NotFoundEntityError(message, HttpStatus.INTERNAL_SERVER_ERROR));
            }
            if (sendEmailInfo.isError()) {
                const { message } = sendEmailInfo.value;
                return error(new NotFoundEntityError(message, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        }

        return success(UserMapper.toHttpResponseUserCreate(createdUser));
    }
}
