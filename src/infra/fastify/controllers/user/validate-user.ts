import { ConfirmAccountRequestProps } from "@presentation/adpaters/user";
import { ValidateUserUseCase } from "@domain/usecases/user";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyRequest } from "fastify";

type ValidateUserControllerFastifyProps = {
    readonly validateUserUseCase: ValidateUserUseCase;
};

export class ValidateUserControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: ValidateUserControllerFastifyProps) {}

    async handle(request: FastifyRequest<{ Body: ConfirmAccountRequestProps }>): Promise<HttpResponse | void> {
        const token = request.cookies["API_AUTH"];

        const validateUserResult = await this.props.validateUserUseCase.execute(token);

        const moment = new Date();

        if (validateUserResult.isError()) {
            const value = validateUserResult.value;
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

        const { value } = validateUserResult;

        return {
            success: true,
            moment,
            data: value,
            status_code: HttpStatus.OK,
        };
    }
}
