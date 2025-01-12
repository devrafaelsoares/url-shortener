import { SendConfirmationAccountRequestProps } from "@presentation/adpaters/user";
import { SendConfirmationAccountUserUseCase } from "@domain/usecases/user";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyRequest } from "fastify";

type SendConfirmationAccountControllerFastifyProps = {
    readonly sendConfirmationAccountUseCase: SendConfirmationAccountUserUseCase;
};

export class SendConfirmationAccountControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: SendConfirmationAccountControllerFastifyProps) {}

    async handle(request: FastifyRequest<{ Body: SendConfirmationAccountRequestProps }>): Promise<HttpResponse | void> {
        const body = request.body;
        const sendConfirmationAccountResult = await this.props.sendConfirmationAccountUseCase.execute(body);

        const moment = new Date();

        if (sendConfirmationAccountResult.isError()) {
            const value = sendConfirmationAccountResult.value;

            if (value instanceof Error) {
                const { message, statusCode } = value;
                return {
                    success: false,
                    moment,
                    status_code: statusCode,
                    data: { message },
                };
            }
            return {
                success: false,
                moment,
                data: value,
                status_code: HttpStatus.BAD_REQUEST,
            };
        }

        return {
            success: true,
            moment,
            data: { message: "Solicitação de confirmação de conta enviada para o email informado" },
            status_code: HttpStatus.OK,
        };
    }
}
