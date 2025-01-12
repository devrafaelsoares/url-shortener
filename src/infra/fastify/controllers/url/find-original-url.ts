import { FindOriginalUrlRequestProps } from "@presentation/adpaters";
import { FindOriginalUrlUseCase } from "@domain/usecases/url";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyReply, FastifyRequest } from "fastify";

type FindOriginalUrlControllerFastifyProps = {
    readonly findOriginalUrlUseCase: FindOriginalUrlUseCase;
};

export class FindOriginalUrlControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: FindOriginalUrlControllerFastifyProps) {}

    async handle(
        request: FastifyRequest<{ Params: FindOriginalUrlRequestProps }>,
        reply: FastifyReply
    ): Promise<HttpResponse | void> {
        const { short_url } = request.params;

        const xForwardedFor = request.headers["x-forwarded-for"] as string | undefined;
        const ipAddress = xForwardedFor || request.ip;
        const userAgent = request.headers["user-agent"];

        const foundUrlResult = await this.props.findOriginalUrlUseCase.execute({
            ip_address: ipAddress,
            user_agent: userAgent,
            short_url,
        });

        const moment = new Date();

        if (foundUrlResult.isError()) {
            const value = foundUrlResult.value;

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
        } = foundUrlResult;

        reply.redirect(url.original_url, HttpStatus.REDIRECT);
    }
}
