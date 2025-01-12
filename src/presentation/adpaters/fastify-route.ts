import { FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "@presentation/protocols/controller";
import { HttpStatus } from "@presentation/protocols";

export function fastifyAdapterRoute(controller: Controller<FastifyRequest, FastifyReply>) {
    return async function (req: FastifyRequest, reply: FastifyReply) {
        const response = await controller.handle(req, reply);

        if (response?.status_code === HttpStatus.CREATED && response.headers) {
            const location = response.headers["location"];
            reply.header("location", location);
        }
        if (Array.isArray(response?.cookies) && response.cookies.length > 0) {
            response.cookies.forEach(({ name, value, options }) => {
                if (name && value) {
                    reply.setCookie(name, value, options || {});
                }
            });
        }

        delete response?.headers;
        reply.status(response!.status_code).send(response);
    };
}
