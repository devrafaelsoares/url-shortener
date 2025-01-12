import { ConfirmAccountRequestProps } from "@presentation/adpaters/user";
import { UserRepository, VerificationTokenRepository } from "@domain/protocols/repositories";
import { Either, error, success } from "@/helpers";
import { ErrorMessages, InternalServerError, NotFoundEntityError, BadRequestEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";

type ConfirmAccountUserUseCaseProps = {
    readonly verificationTokenRepository: VerificationTokenRepository;
    readonly userRepository: UserRepository;
};

export class ConfirmAccountUserUseCase {
    constructor(private props: ConfirmAccountUserUseCaseProps) {}
    async execute({
        id,
        token,
    }: ConfirmAccountRequestProps): Promise<
        Either<NotFoundEntityError | BadRequestEntityError | InternalServerError, void>
    > {
        const foundVerificationToken = await this.props.verificationTokenRepository.findByToken(token);

        if (!foundVerificationToken) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_TOKEN, HttpStatus.NOT_FOUND));
        }

        const foundUser = await this.props.userRepository.findById(id);

        if (!foundUser) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_USER, HttpStatus.NOT_FOUND));
        }

        const verificationToken = foundUser.verificationTokens.find(
            verificationTokenUser => verificationTokenUser.id === foundVerificationToken.id
        );

        if (!verificationToken) {
            return error(new NotFoundEntityError(ErrorMessages.TOKEN_NOT_MATCH_USER, HttpStatus.UNAUTHORIZED));
        }

        if (foundUser.isActive) {
            return error(new BadRequestEntityError(ErrorMessages.ACCOUNT_ALREADY_ACTIVATED, HttpStatus.BAD_REQUEST));
        }

        const tokenIsValid = this.getCurrentDate().getTime() < verificationToken.expiresAt.getTime();

        if (!tokenIsValid) {
            return error(new NotFoundEntityError(ErrorMessages.EXPIRED_TOKEN, HttpStatus.GONE));
        }

        foundUser.activate();

        const updatedUser = await this.props.userRepository.save(foundUser);

        if (!updatedUser) {
            return error(
                new InternalServerError(ErrorMessages.ERROR_CREATING_ACCOUNT, HttpStatus.INTERNAL_SERVER_ERROR)
            );
        }

        return success(undefined);
    }

    private getCurrentDate(): Date {
        const currentDate = new Date();
        return new Date(currentDate.getTime());
    }
}
