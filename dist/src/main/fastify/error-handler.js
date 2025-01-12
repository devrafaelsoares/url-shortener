"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNotFoundHandler = exports.errorHandler = void 0;
const protocols_1 = require("../../presentation/protocols");
const zod_1 = require("zod");
const errorHandler = (error, request, reply) => {
    if (error instanceof zod_1.ZodError) {
        return reply.status(protocols_1.HttpStatus.BAD_REQUEST).send({
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
    if (error.statusCode === protocols_1.HttpStatus.TO_MANY_REQUESTS) {
        return reply.status(protocols_1.HttpStatus.TO_MANY_REQUESTS).send({
            success: false,
            moment: new Date(),
            data: {
                message: "Muitas requisições feitas, por favor tente novamente mais tarde.",
            },
            status_code: error.statusCode,
        });
    }
    return reply.status(protocols_1.HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        moment: new Date(),
        data: { errors: error.validation },
        status_code: error.statusCode,
    });
};
exports.errorHandler = errorHandler;
const setNotFoundHandler = (app) => {
    app.setNotFoundHandler((_req, reply) => {
        reply.code(protocols_1.HttpStatus.NOT_FOUND).send({
            success: false,
            moment: new Date(),
            data: { message: "Rota não encontrada" },
            status_code: protocols_1.HttpStatus.NOT_FOUND,
        });
    });
};
exports.setNotFoundHandler = setNotFoundHandler;
