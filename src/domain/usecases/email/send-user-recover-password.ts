import { Either, error, success, createFrontUrlBuilderDevelopment } from "@/helpers";
import { NotFoundEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { Email, User, VerificationTokenTypes } from "@domain/entities";
import { userRecoverPasswordApiTemplateHtml } from "@presentation/templates/email";
import { EmailService } from "@domain/protocols/providers";

type SendUserRecoverPasswordUseCaseProps = {
    readonly emailService: EmailService;
};

export class SendUserRecoverPasswordUseCase {
    private readonly urlBuilder;
    constructor(private props: SendUserRecoverPasswordUseCaseProps) {
        this.urlBuilder = createFrontUrlBuilderDevelopment();
    }

    async send(user: User): Promise<Either<Error, void>> {
        const { id, email, verificationTokens } = user;

        const htmlContent = userRecoverPasswordApiTemplateHtml.replace("[ID_PASSWORD_RECOVER]", id).replace(
            "[TOKEN_PASSWORD_RECOVER]",

            verificationTokens
                .filter(token => token.type === VerificationTokenTypes.PASSWORD_RECOVERY)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].token
        );

        const sendEmailInfo = await this.props.emailService.send(
            Email.create({
                from: "rafael.soares.developer@gmail.com",
                to: email,
                subject: "Recuperação de conta - Altere a sua senha",
                html: htmlContent,
            })
        );

        if (sendEmailInfo.isError()) {
            const { message } = sendEmailInfo.value;

            return error(new NotFoundEntityError(message, HttpStatus.INTERNAL_SERVER_ERROR));
        }

        return success(undefined);
    }
}
