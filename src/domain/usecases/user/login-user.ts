import { PasswordProvider } from "@domain/protocols/providers";
import { Either, error, success, TimeUtils } from "@/helpers";
import { ErrorMessages, UnauthorizedEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { UserMemoryRepository, UserRepository } from "@domain/protocols/repositories";
import {
    LoginUserRequestProps,
    LoginUserResponseProps,
    LoginUserResponseTokenProps,
    PayloadUserProps,
} from "@presentation/adpaters/user";
import env from "@env";
import { JwtToken } from "@infra/providers/token";

type LoginUserUseCaseConfigProps = {
    readonly maxLoginAttempts: number;
    readonly blockDuration: number;
};

type LoginUserUseCaseProps = {
    readonly userRepository: UserRepository;
    readonly userMemoryRepository: UserMemoryRepository;
    readonly passwordProvider: PasswordProvider;
    readonly loginUserUseCaseConfig: LoginUserUseCaseConfigProps;
};

export class LoginUserUseCase {
    constructor(private props: LoginUserUseCaseProps) {}

    async execute({
        email,
        password,
    }: LoginUserRequestProps): Promise<Either<UnauthorizedEntityError, LoginUserResponseProps>> {
        const LOGIN_BLOCK_KEY = `auth:login:block:${email}`;
        const LOGIN_ATTEMPTS_KEY = `auth:login:attempts:${email}`;

        const isBlocked = await this.props.userMemoryRepository.userHasAccountBlocked(LOGIN_BLOCK_KEY);

        if (isBlocked) {
            return error(new UnauthorizedEntityError(ErrorMessages.ACCOUNT_TEMPORARILY_BLOCKED, HttpStatus.FORBIDDEN));
        }

        const foundUser = await this.props.userRepository.findByEmail(email);

        if (!foundUser) {
            await this.handleFailedAttempt(LOGIN_ATTEMPTS_KEY, LOGIN_BLOCK_KEY);
            return error(new UnauthorizedEntityError(ErrorMessages.INVALID_USER_PASSWORD, HttpStatus.UNAUTHORIZED));
        }

        if (!foundUser.isActive) {
            await this.handleFailedAttempt(LOGIN_ATTEMPTS_KEY, LOGIN_BLOCK_KEY);
            return error(new UnauthorizedEntityError(ErrorMessages.ACCOUNT_NOT_ACTIVATED, HttpStatus.UNAUTHORIZED));
        }

        const isSamePassword = await this.props.passwordProvider.verify(password, foundUser.password);

        if (!isSamePassword) {
            await this.handleFailedAttempt(LOGIN_ATTEMPTS_KEY, LOGIN_BLOCK_KEY);
            return error(new UnauthorizedEntityError(ErrorMessages.INVALID_USER_PASSWORD, HttpStatus.UNAUTHORIZED));
        }

        await this.props.userMemoryRepository.removeAttemptLock(LOGIN_ATTEMPTS_KEY);

        const tokenData = this.generateToken(foundUser.id, env.SECRET_KEY_AUTH, env.TOKEN_DURATION);

        const refreshTokenData = this.generateToken(foundUser.id, env.SECRET_KEY_AUTH, env.REFRESH_TOKEN_DURATION);

        return success({
            token: tokenData,
            refresh_token: refreshTokenData,
            user_id: foundUser.id,
        });
    }

    private generateToken(userId: string, secret: string, expiresIn: string): LoginUserResponseTokenProps {
        const now = new Date();
        const durationInSeconds = TimeUtils.parseDuration(expiresIn);
        if (!durationInSeconds) {
            throw new Error("Invalid expiresIn format");
        }

        const expires = new Date(now.getTime() + durationInSeconds * 1000);

        const jwtToken = new JwtToken<PayloadUserProps>({ secret, payload: { id: userId }, expirationTime: expiresIn });

        const { token } = jwtToken.generate();

        return { value: token, expires };
    }

    private async handleFailedAttempt(attemptsKey: string, blockKey: string): Promise<void> {
        const attempts = await this.props.userMemoryRepository.addNewAttemptFails(attemptsKey);

        if (attempts === 1) {
            await this.props.userMemoryRepository.addAttemptLock(
                attemptsKey,
                this.props.loginUserUseCaseConfig.blockDuration
            );
        }

        if (attempts >= this.props.loginUserUseCaseConfig.maxLoginAttempts) {
            await this.props.userMemoryRepository.addTemporaryBlock(
                blockKey,
                "1",
                this.props.loginUserUseCaseConfig.blockDuration
            );

            await this.props.userMemoryRepository.removeAttemptLock(attemptsKey);
        }
    }
}
