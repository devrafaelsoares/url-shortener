import { UserRepository, VerificationTokenRepository } from "@domain/protocols/repositories";
import { Either, error, success } from "@/helpers";
import { ErrorMessages, NotFoundEntityError, UnauthorizedEntityError } from "@presentation/errors";
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
    }: RecoverChangePasswordRequestProps): Promise<Either<NotFoundEntityError | UnauthorizedEntityError, void>> {
        const foundUser = await this.props.userRepository.findById(user_id);

        if (!foundUser) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_USER, HttpStatus.NOT_FOUND));
        }

        const foundToken = await this.props.verificationTokenRepository.findByToken(token);

        if (!foundToken) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_TOKEN, HttpStatus.NOT_FOUND));
        }

        // Validar que o token pertence ao usuário (previne Account Takeover)
        const tokenBelongsToUser = foundUser.verificationTokens.some(
            verificationToken => verificationToken.id === foundToken.id
        );

        if (!tokenBelongsToUser) {
            return error(
                new UnauthorizedEntityError(ErrorMessages.TOKEN_NOT_MATCH_USER, HttpStatus.FORBIDDEN)
            );
        }

        // Validar expiração do token
        const tokenIsValid = new Date().getTime() < foundToken.expiresAt.getTime();

        if (!tokenIsValid) {
            return error(new NotFoundEntityError(ErrorMessages.EXPIRED_TOKEN, HttpStatus.GONE));
        }

        await foundUser.setPassword(new_password, {
            provider: this.props.passwordProvider,
            salt: foundUser.hashSalt,
        });

        await this.props.userRepository.save(foundUser);

        // Deleta todos os tokens de recuperação de senha deste usuário
        const recoveryTokens = foundUser.verificationTokens.filter(
            t => t.type === "PASSWORD_RECOVERY"
        );

        for (const t of recoveryTokens) {
            await this.props.verificationTokenRepository.deleteByToken(t.token);
        }

        return success(undefined);
    }
}
