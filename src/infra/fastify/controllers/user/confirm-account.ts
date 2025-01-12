import { ConfirmAccountRequestProps } from "@presentation/adpaters/user";
import { ConfirmAccountUserUseCase } from "@domain/usecases/user";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyRequest } from "fastify";

type ConfirmAccountControllerFastifyProps = {
    readonly confirmAccountUserUseCase: ConfirmAccountUserUseCase;
};

export class ConfirmAccountControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: ConfirmAccountControllerFastifyProps) {}

    async handle(request: FastifyRequest<{ Body: ConfirmAccountRequestProps }>): Promise<HttpResponse | void> {
        const body = request.body;

        const confirmUserResult = await this.props.confirmAccountUserUseCase.execute(body);

        const moment = new Date();

        if (confirmUserResult.isError()) {
            const value = confirmUserResult.value;
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
            data: { message: "Conta ativada com sucesso" },
            status_code: HttpStatus.OK,
        };
    }
}
