import { HttpResponse, HttpStatus } from "@presentation/protocols";
import { RecoverChangePasswordRequestProps } from "@presentation/adpaters/user";
import { FastifyRequest } from "fastify";
import { RecoverChangePasswordUseCase } from "@domain/usecases/user";

type RecoverChangePasswordControllerFastifyProps = {
    readonly recoverChangePasswordUseCase: RecoverChangePasswordUseCase;
};

export class RecoverChangePasswordControllerFastify {
    constructor(private props: RecoverChangePasswordControllerFastifyProps) {}

    async handle(request: FastifyRequest<{ Body: RecoverChangePasswordRequestProps }>): Promise<HttpResponse | void> {
        const body = request.body;
        const recoverChangePasswordResult = await this.props.recoverChangePasswordUseCase.execute(body);

        const moment = new Date();

        if (recoverChangePasswordResult.isError()) {
            const value = recoverChangePasswordResult.value;

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
            data: { message: "Senha alterada com sucesso" },
            status_code: HttpStatus.OK,
        };
    }
}
