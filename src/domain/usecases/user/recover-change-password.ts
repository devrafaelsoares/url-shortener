import { UserRepository, VerificationTokenRepository } from "@domain/protocols/repositories";
import { Either, error, success } from "@/helpers";
import { ErrorMessages, NotFoundEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { RecoverChangePasswordRequestProps } from "@presentation/adpaters/user";
import { PasswordProvider } from "@domain/protocols/providers";

type RecoverChangePasswordUseCaseProps = {
    readonly userRepository: UserRepository;
    readonly verificationTokenRepository: VerificationTokenRepository;
    readonly passwordProvider: PasswordProvider;
};

export class RecoverChangePasswordUseCase {
    constructor(private props: RecoverChangePasswordUseCaseProps) {}

    async execute({
        user_id,
        new_password,
        token,
    }: RecoverChangePasswordRequestProps): Promise<Either<NotFoundEntityError, void>> {
        const foundUser = await this.props.userRepository.findById(user_id);

        if (!foundUser) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_USER, HttpStatus.NOT_FOUND));
        }

        const foundToken = await this.props.verificationTokenRepository.findByToken(token);

        if (!foundToken) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_TOKEN, HttpStatus.NOT_FOUND));
        }

        await foundUser.setPassword(new_password, {
            provider: this.props.passwordProvider,
            salt: foundUser.hashSalt,
        });

        await this.props.userRepository.save(foundUser);

        await this.props.verificationTokenRepository.deleteByToken(token);

        return success(undefined);
    }
}
