import { HttpStatus } from "@presentation/protocols";
import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) => {
    if (error instanceof ZodError) {
        return reply.status(HttpStatus.BAD_REQUEST).send({
            success: false,
            moment: new Date(),
            data: {
                errors: error.errors.map(({ path, message }) => ({
                    path: path[0],
                    message,
                })),
            },
            status_code: error.statusCode,
        });
    }

    if (error.statusCode === HttpStatus.TO_MANY_REQUESTS) {
        return reply.status(HttpStatus.TO_MANY_REQUESTS).send({
            success: false,
            moment: new Date(),
            data: {
                message: "Muitas requisições feitas, por favor tente novamente mais tarde.",
            },
            status_code: error.statusCode,
        });
    }

    return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        moment: new Date(),
        data: { errors: error.validation },
        status_code: error.statusCode,
    });
};

export const setNotFoundHandler = (app: FastifyInstance) => {
    app.setNotFoundHandler((_req, reply) => {
        reply.code(HttpStatus.NOT_FOUND).send({
            success: false,
            moment: new Date(),
            data: { message: "Rota não encontrada" },
            status_code: HttpStatus.NOT_FOUND,
        });
    });
};
