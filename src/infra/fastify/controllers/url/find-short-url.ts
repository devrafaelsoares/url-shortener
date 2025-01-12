import { FindShortUrlRequestProps } from "@presentation/adpaters";
import { FindShortUrlUseCase } from "@domain/usecases/url";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyRequest } from "fastify";

type FindShortUrlControllerFastifyProps = {
    readonly findShortUrlUseCase: FindShortUrlUseCase;
};

export class FindShortUrlControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: FindShortUrlControllerFastifyProps) {}

    async handle(request: FastifyRequest<{ Params: FindShortUrlRequestProps }>): Promise<HttpResponse | void> {
        const { id } = request.params;
        const foundShortUrlResult = await this.props.findShortUrlUseCase.execute({ id });

        const moment = new Date();

        if (foundShortUrlResult.isError()) {
            const value = foundShortUrlResult.value;

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
        } = foundShortUrlResult;

        return {
            success: true,
            moment,
            data: {
                url: {
                    short_url: url.short_url,
                },
            },
            status_code: HttpStatus.OK,
        };
    }
}
