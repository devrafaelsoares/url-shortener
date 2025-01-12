import { ConfirmRecoverPasswordRequestProps } from "@presentation/adpaters/user";
import { ConfirmRecoverPasswordUserUseCase } from "@domain/usecases/user";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyRequest } from "fastify";

type ConfirmRecoverPasswordControllerFastifyProps = {
    readonly confirmRecoverPasswordUseCase: ConfirmRecoverPasswordUserUseCase;
};

export class ConfirmRecoverPasswordControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: ConfirmRecoverPasswordControllerFastifyProps) {}

    async handle(request: FastifyRequest<{ Body: ConfirmRecoverPasswordRequestProps }>): Promise<HttpResponse | void> {
        const body = request.body;

        const confirmRecoverPassword = await this.props.confirmRecoverPasswordUseCase.execute(body);

        const moment = new Date();

        if (confirmRecoverPassword.isError()) {
            const value = confirmRecoverPassword.value;
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
            data: null,
            status_code: HttpStatus.OK,
        };
    }
}
