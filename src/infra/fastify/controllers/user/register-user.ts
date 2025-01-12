import { CreateUserRequestProps } from "@presentation/adpaters/user";
import { RegisterUserUseCase } from "@domain/usecases/user";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyRequest } from "fastify";

type RegisterUserControllerFastifyProps = {
    readonly registerUserUseCase: RegisterUserUseCase;
};

export class RegisterUserControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: RegisterUserControllerFastifyProps) {}

    async handle(request: FastifyRequest<{ Body: CreateUserRequestProps }>): Promise<HttpResponse | void> {
        const body = request.body;
        const createdUserResult = await this.props.registerUserUseCase.execute(body);

        const moment = new Date();

        if (createdUserResult.isError()) {
            const value = createdUserResult.value;

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

        const {
            value: { ...user },
        } = createdUserResult;

        return {
            success: true,
            moment,
            data: { user },
            status_code: HttpStatus.OK,
        };
    }
}
