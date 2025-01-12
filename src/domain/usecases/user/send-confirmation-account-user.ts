import { IdProvider, TokenProvider } from "@domain/protocols/providers";
import { SendUserConfirmationEmailUseCase } from "@domain/usecases/email";
import {
    UserRepository,
    VerificationTokenMemoryRepository,
    VerificationTokenRepository,
} from "@domain/protocols/repositories";
import { SendEmail, VerificationToken, VerificationTokenTypes } from "@domain/entities";
import { Either, error, success, TimeUtils } from "@/helpers";
import { BadRequestEntityError, ErrorMessages, InternalServerError, NotFoundEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { SendConfirmationAccountRequestProps } from "@presentation/adpaters/user";
import env from "@env";

type SendConfirmationAccountUserUseCaseProps = {
    readonly userRepository: UserRepository;
    readonly verificationTokenRepository: VerificationTokenRepository;
    readonly verificationTokenMemoryRepository: VerificationTokenMemoryRepository;
    readonly idProvider: IdProvider;
    readonly tokenProvider: TokenProvider;
    readonly sendEmailUserEmailConfirmation: SendUserConfirmationEmailUseCase;
    readonly sendEmail: SendEmail;
};

export class SendConfirmationAccountUserUseCase {
    constructor(private props: SendConfirmationAccountUserUseCaseProps) {}

    async execute({
        id,
    }: SendConfirmationAccountRequestProps): Promise<Either<NotFoundEntityError | InternalServerError, void>> {
        const BLOCK_KEY = `verification:token:${id}`;

        const isBlocked = await this.props.verificationTokenMemoryRepository.canSendToken(BLOCK_KEY);

        if (isBlocked) {
            const time = await this.props.verificationTokenMemoryRepository.getWaitingTime(BLOCK_KEY);
            return error(
                new BadRequestEntityError(
                    `Você poderá enviar uma nova solicitação em ${TimeUtils.parseTime(time)}`,
                    HttpStatus.BAD_REQUEST
                )
            );
        }

        const foundUser = await this.props.userRepository.findById(id);

        if (!foundUser) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_USER, HttpStatus.NOT_FOUND));
        }

        if (foundUser.isActive) {
            return error(new BadRequestEntityError(ErrorMessages.ACCOUNT_ALREADY_ACTIVATED, HttpStatus.BAD_REQUEST));
        }

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

        const lastRemoveVerificationToken = foundUser.removeLastVerificationToken();

        if (lastRemoveVerificationToken) {
            await this.props.verificationTokenRepository.delete(lastRemoveVerificationToken.id);
        }

        foundUser.addVerificationToken(userEmailConfirmation);

        await this.props.verificationTokenRepository.create(userEmailConfirmation, id);

        await this.props.verificationTokenMemoryRepository.addTemporaryHold(
            BLOCK_KEY,
            "1",
            TimeUtils.parseDuration(env.VERIFICATION_TOKEN_RESEND_INTERVAL) as number
        );

        if (this.props.sendEmail === SendEmail.TRUE) {
            const sendEmailInfo = await this.props.sendEmailUserEmailConfirmation.send(foundUser);

            if (sendEmailInfo.isError()) {
                const { message } = sendEmailInfo.value;
                return error(new NotFoundEntityError(message, HttpStatus.INTERNAL_SERVER_ERROR));
            }

            if (sendEmailInfo.isError()) {
                const { message } = sendEmailInfo.value;
                return error(new NotFoundEntityError(message, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        }

        return success(undefined);
    }
}
