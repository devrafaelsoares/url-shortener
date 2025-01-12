import { CreateUrlRequestProps } from "@presentation/adpaters";
import { CreateShortUrlUseCase } from "@domain/usecases/url";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyRequest } from "fastify";

type CreateShortUrlControllerFastifyProps = {
    readonly createShortUrlUseCase: CreateShortUrlUseCase;
};

export class CreateShortUrlControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: CreateShortUrlControllerFastifyProps) {}

    async handle(request: FastifyRequest<{ Body: CreateUrlRequestProps }>): Promise<HttpResponse | void> {
        const { original_url } = request.body;
        const token = request.cookies["API_AUTH"];
        const createdUrlResult = await this.props.createShortUrlUseCase.execute({ original_url, token });

        const moment = new Date();

        if (createdUrlResult.isError()) {
            const value = createdUrlResult.value;

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
            value: { ...url },
        } = createdUrlResult;

        const location = `${request.host}/${url.short_url}`;

        return {
            success: true,
            moment,
            data: {
                url: {
                    short_url: url.short_url,
                },
            },
            headers: {
                location,
            },
            status_code: HttpStatus.CREATED,
        };
    }
}
