import { Either, error, success, createFrontUrlBuilderDevelopment } from "@/helpers";
import { NotFoundEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { Email, User, VerificationTokenTypes } from "@domain/entities";
import { userEmailConfirmationApiTemplateHtml } from "@presentation/templates/email";
import { EmailService } from "@domain/protocols/providers";

type SendUserConfirmationEmailUseCaseProps = {
    readonly emailService: EmailService;
    readonly emailFrom: string;
};

export class SendUserConfirmationEmailUseCase {
    private readonly urlBuilder;
    constructor(private props: SendUserConfirmationEmailUseCaseProps) {
        this.urlBuilder = createFrontUrlBuilderDevelopment();
    }

    async send(user: User): Promise<Either<Error, void>> {
        const { id, email, verificationTokens } = user;
        const htmlContent = userEmailConfirmationApiTemplateHtml
            .replace("[ID_ACCOUNT_CONFIRMATION]", id)
            .replace(
                "[TOKEN_ACCOUNT_CONFIRMATION]",
                verificationTokens
                    .filter(token => token.type === VerificationTokenTypes.CONFIRMATION_EMAIL)
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].token
            );

        const sendEmailInfo = await this.props.emailService.send(
            Email.create({
                from: this.props.emailFrom,
                to: email,
                subject: "Confirmação de Email - Ative sua Conta",
                html: htmlContent,
            })
        );

        if (sendEmailInfo.isError()) {
            return error(new NotFoundEntityError("Falha no serviço de envio de e-mails. Tente novamente mais tarde.", HttpStatus.INTERNAL_SERVER_ERROR));
        }

        return success(undefined);
    }
}
