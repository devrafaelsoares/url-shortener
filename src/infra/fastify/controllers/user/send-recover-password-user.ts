import { SendRecoverPasswordRequestProps } from "@presentation/adpaters/user";
import { SendRecoverPasswordUserUseCase } from "@domain/usecases/user";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyRequest } from "fastify";

type SendRecoverPasswordControllerFastifyProps = {
    readonly sendRecoverPasswordUseCase: SendRecoverPasswordUserUseCase;
};

export class SendRecoverPasswordControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: SendRecoverPasswordControllerFastifyProps) {}

    async handle(request: FastifyRequest<{ Body: SendRecoverPasswordRequestProps }>): Promise<HttpResponse | void> {
        const body = request.body;
        const sendRecoverPasswordResult = await this.props.sendRecoverPasswordUseCase.execute(body);
        const moment = new Date();

        if (sendRecoverPasswordResult.isError()) {
            const value = sendRecoverPasswordResult.value;

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
            data: { message: "Solicitação de alteração de senha enviada para o email informado" },
            status_code: HttpStatus.OK,
        };
    }
}
