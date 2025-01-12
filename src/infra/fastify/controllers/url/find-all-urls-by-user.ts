import { FindAllUrlsByUserParamsProps, FindAllUrlsByUserQueryProps } from "@presentation/adpaters";
import { FindAllUrlsByUserUseCase } from "@domain/usecases/url";
import { Controller, HttpResponse, HttpStatus } from "@presentation/protocols";
import { FastifyRequest } from "fastify";

type FindAllUrlsByUserControllerFastifyProps = {
    readonly findAllUrlsByUserUseCase: FindAllUrlsByUserUseCase;
};

export class FindAllUrlsByUserControllerFastify implements Controller<FastifyRequest> {
    constructor(private props: FindAllUrlsByUserControllerFastifyProps) {}

    async handle(
        request: FastifyRequest<{ Params: FindAllUrlsByUserParamsProps; Querystring: FindAllUrlsByUserQueryProps }>
    ): Promise<HttpResponse | void> {
        const { user_id } = request.params;
        const { limit = 10, page = 1 } = request.query;

        const foundAllUrlsResult = await this.props.findAllUrlsByUserUseCase.execute({ user_id, limit, page });

        const moment = new Date();

        if (foundAllUrlsResult.isError()) {
            const value = foundAllUrlsResult.value;

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

        const { value } = foundAllUrlsResult;

        return {
            success: true,
            moment,
            data: value,
            status_code: HttpStatus.OK,
        };
    }
}
