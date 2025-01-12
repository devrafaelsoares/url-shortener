import { RevalidateUserRequestProps } from "@presentation/adpaters/user";
import { RevalidateUserUseCase } from "@domain/usecases/user";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyRequest } from "fastify";

type RevalidateUserControllerFastifyProps = {
    readonly revalidateUserUseCase: RevalidateUserUseCase;
};

export class RevalidateUserControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: RevalidateUserControllerFastifyProps) {}

    async handle(request: FastifyRequest<{ Body: RevalidateUserRequestProps }>): Promise<HttpResponse | void> {
        const { refresh_token: refreshTokenPayload } = request.body;

        const revalidateUserResult = await this.props.revalidateUserUseCase.execute({
            refresh_token: refreshTokenPayload,
        });

        const moment = new Date();

        if (revalidateUserResult.isError()) {
            const value = revalidateUserResult.value;

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
            value: { value, expires },
        } = revalidateUserResult;

        return {
            success: true,
            moment,
            data: value,
            status_code: HttpStatus.OK,
            cookies: [
                {
                    name: "API_AUTH",
                    value,
                    options: { expires, httpOnly: true },
                },
            ],
        };
    }
}
