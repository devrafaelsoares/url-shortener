import { HttpStatus } from "@presentation/protocols";
import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.status(HttpStatus.BAD_REQUEST).send({
            success: false,
            moment: new Date(),
            data: {
                errors: error.validation.map(err => ({
                    path: err.params?.issue?.path?.join('.') || err.instancePath || "unknown",
                    message: err.message,
                })),
            },
            status_code: HttpStatus.BAD_REQUEST,
        });
    }

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
            status_code: error.statusCode || HttpStatus.BAD_REQUEST,
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

    request.log.error({ err: error, requestId: request.id }, "Unhandled error");

    return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        moment: new Date(),
        data: { message: "Erro interno do servidor" },
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
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
