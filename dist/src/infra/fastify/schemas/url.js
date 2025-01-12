"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllUrlsSchema = exports.FindOriginalUrlSchema = exports.FindShortUrlSchema = exports.CreateUrlSchema = void 0;
const url_1 = require("../../fastify/validators/url");
exports.CreateUrlSchema = {
    description: "Criação de uma URL encurtada a partir de uma URL original.",
    tags: ["URL"],
    body: url_1.UrlCreateRequestBodySchema,
    response: {
        201: url_1.SuccessUrlResponseSchema.describe("URL encurtada criada com sucesso e disponível para uso."),
        401: url_1.UnauthorizedUrlResponseSchema.describe("Usuário não autorizado a realizar a operação."),
        404: url_1.NotFoundUrlResponseSchema.describe("Usuário não encontrado no sistema."),
        409: url_1.ConfilitUrlResponseSchema.describe("A URL encurtada já está registrada no sistema."),
    },
};
exports.FindShortUrlSchema = {
    description: "Recupera o código da URL encurtada associada a URL original.",
    tags: ["URL"],
    response: {
        404: url_1.NotFoundUrlResponseSchema.describe("O código fornecido não corresponde a nenhuma URL encurtada existente."),
    },
    params: url_1.FindShortUrlParamsStringSchema.describe("Parâmetros de rota contendo a URL original para busca do código curto associado."),
};
exports.FindOriginalUrlSchema = {
    description: "Recupera a URL original associada ao identificador do registro.",
    tags: ["URL"],
    response: {
        404: url_1.NotFoundUrlResponseSchema.describe("O código fornecido não corresponde a nenhuma URL encurtada existente."),
    },
    params: url_1.FindOriginalUrlParamsStringSchema.describe("Parâmetros de rota, onde o código da URL encurtada será utilizado para recuperar a URL original associada."),
};
exports.FindAllUrlsSchema = {
    description: "Recupera a URL original associada ao identificador do registro.",
    tags: ["URL"],
    response: {
        200: url_1.SuccessUrlsResponseSchema.describe("Resposta com sucesso, contendo a URL original. O código fornecido não corresponde a nenhuma URL encurtada existente."),
        400: url_1.BadRequestUrlResponseSchema.describe("O número da página deve ser maior ou igual a 1. Verifique o valor da página fornecido."),
        404: url_1.NotFoundUrlResponseSchema.describe("Usuário não encontrado no sistema."),
    },
    querystring: url_1.UrlPaginateQueryStringSchema.describe("Parâmetros de consulta para paginar a lista de URLs encurtadas."),
    params: url_1.UrlPaginateParamsStringSchema.describe("Parâmetros de rota, incluindo o identificador do usuário para recuperar suas URLs."),
};
