import { LoginUserRequestProps } from "@presentation/adpaters/user";
import { LoginUserUseCase } from "@domain/usecases/user";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyRequest } from "fastify";

type LoginUserControllerFastifyProps = {
    readonly loginUserUseCase: LoginUserUseCase;
};

export class LoginUserControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: LoginUserControllerFastifyProps) {}

    async handle(request: FastifyRequest<{ Body: LoginUserRequestProps }>): Promise<HttpResponse | void> {
        const body = request.body;
        const loginUserResult = await this.props.loginUserUseCase.execute(body);

        const moment = new Date();

        if (loginUserResult.isError()) {
            const value = loginUserResult.value;

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
            value: { token, refresh_token, user_id },
        } = loginUserResult;

        return {
            success: true,
            moment,
            data: {
                token: token.value,
                refresh_token: refresh_token.value,
                user_id,
            },
            status_code: HttpStatus.OK,
            cookies: [
                {
                    name: "API_AUTH",
                    value: token.value,
                    options: {
                        httpOnly: true,
                        expires: token.expires,
                    },
                },
                {
                    name: "REFRESH_TOKEN",
                    value: refresh_token.value,
                    options: {
                        httpOnly: true,
                        expires: refresh_token.expires,
                    },
                },
                {
                    name: "USER_ID",
                    value: user_id,
                    options: {
                        httpOnly: true,
                    },
                },
            ],
        };
    }
}
