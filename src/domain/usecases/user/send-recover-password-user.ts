import { Either, error, success, TimeUtils } from "@/helpers";
import { BadRequestEntityError, ErrorMessages, InternalServerError, NotFoundEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { SendEmail, VerificationToken, VerificationTokenTypes } from "@domain/entities";
import {
    UserRepository,
    VerificationTokenMemoryRepository,
    VerificationTokenRepository,
} from "@domain/protocols/repositories";
import { IdProvider, TokenProvider } from "@domain/protocols/providers";
import { SendUserRecoverPasswordUseCase } from "@domain/usecases/email";
import { SendRecoverPasswordRequestProps } from "@presentation/adpaters/user";
import env from "@env";

type SendRecoverPasswordUserUseCaseProps = {
    readonly userRepository: UserRepository;
    readonly verificationTokenRepository: VerificationTokenRepository;
    readonly verificationTokenMemoryRepository: VerificationTokenMemoryRepository;
    readonly idProvider: IdProvider;
    readonly tokenProvider: TokenProvider;
    readonly sendUserRecoverPasswordUseCase: SendUserRecoverPasswordUseCase;
    readonly sendEmail: SendEmail;
};

export class SendRecoverPasswordUserUseCase {
    constructor(private props: SendRecoverPasswordUserUseCaseProps) {}

    async execute({
        email,
    }: SendRecoverPasswordRequestProps): Promise<Either<NotFoundEntityError | InternalServerError, void>> {
        const BLOCK_KEY = `verification:token:${email}`;

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

        const foundUser = await this.props.userRepository.findByEmail(email);

        if (!foundUser) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_USER, HttpStatus.NOT_FOUND));
        }

        const { token, expiresAt } = this.props.tokenProvider.generate();

        const userRecoverPasswordConfirmation = await VerificationToken.create({
            props: {
                token,
                expiresAt,
                type: VerificationTokenTypes.PASSWORD_RECOVERY,
            },
            idProvider: this.props.idProvider,
            tokenProvider: this.props.tokenProvider,
        });

        foundUser.addVerificationToken(userRecoverPasswordConfirmation);

        await this.props.verificationTokenRepository.create(userRecoverPasswordConfirmation, foundUser.id);

        await this.props.verificationTokenMemoryRepository.addTemporaryHold(
            BLOCK_KEY,
            "1",
            TimeUtils.parseDuration(env.VERIFICATION_TOKEN_RESEND_INTERVAL) as number
        );

        if (this.props.sendEmail === SendEmail.TRUE) {
            const sendEmailInfo = await this.props.sendUserRecoverPasswordUseCase.send(foundUser);

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
