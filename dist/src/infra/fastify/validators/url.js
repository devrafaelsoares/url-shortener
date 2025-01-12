"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedUrlResponseSchema = exports.BadRequestUrlResponseSchema = exports.NotFoundUrlResponseSchema = exports.ConfilitUrlResponseSchema = exports.SuccessUrlsResponseSchema = exports.SuccessUrlResponseSchema = exports.ErrorMessageSchema = exports.CreateUrlSchemaStructure = exports.FindOriginalUrlParamsStringSchema = exports.FindShortUrlParamsStringSchema = exports.UrlPaginateParamsStringSchema = exports.UrlPaginateResponseSchema = exports.UrlPaginateQueryStringSchema = exports.UrlCreateRequestBodySchema = exports.UrlResponseBodySchema = void 0;
const zod_1 = require("zod");
const structure_1 = require("../../fastify/response/structure");
const utils_1 = require("../../fastify/schemas/utils");
exports.UrlResponseBodySchema = zod_1.z.object({
    id: zod_1.z.string().describe("Identificador único da URL no sistema."),
    original_url: zod_1.z.string().url().describe("A URL original que foi encurtada. Deve ser uma URL válida."),
    short_url: zod_1.z.string().describe("A URL encurtada gerada pelo sistema."),
    hit_count: zod_1.z.coerce
        .number()
        .describe("Contagem de acessos à URL encurtada. É convertido para número, caso venha como string."),
    expires_at: zod_1.z.date().nullable().describe("Data e hora de expiração da URL, ou `null` se não houver expiração."),
    created_at: zod_1.z.date().describe("Data e hora de criação da URL no sistema."),
});
exports.UrlCreateRequestBodySchema = zod_1.z.object({
    original_url: zod_1.z
        .string({ required_error: "É necessário informar o a url a se encurtada" })
        .min(1, "É necessário informar o a url a se encurtada")
        .url({ message: "URL informada é inválida" })
        .describe("URL original a ser encurtada."),
});
exports.UrlPaginateQueryStringSchema = zod_1.z
    .object({
    page: zod_1.z.coerce.number().optional().describe("Número da página para consulta de URLs paginadas."),
    limit: zod_1.z.coerce.number().optional().describe("Limite de itens por página para a consulta."),
})
    .describe("Estrutura dos parâmetros de query string para consulta de URLs paginadas.");
exports.UrlPaginateResponseSchema = (0, utils_1.PaginateSchema)(exports.UrlResponseBodySchema).describe("Estrutura de resposta paginada contendo URLs encurtadas.");
exports.UrlPaginateParamsStringSchema = zod_1.z
    .object({
    user_id: zod_1.z.string().describe("Identificador único do usuário relacionado às URLs."),
})
    .describe("Estrutura dos parâmetros de rota para consulta de URLs de um usuário específico.");
exports.FindShortUrlParamsStringSchema = zod_1.z
    .object({
    id: zod_1.z
        .string()
        .describe("Identificador único da URL no sistema.")
        .min(1, "É necessário informar o identificador do usuário."),
})
    .describe("Estrutura dos parâmetros de rota para gerar ou consultar o código curto associado ao identificador único da URL no sistema.");
exports.FindOriginalUrlParamsStringSchema = zod_1.z
    .object({
    short_url: zod_1.z.string().describe("Código curto gerado para identificar a URL encurtada."),
})
    .describe("Estrutura dos parâmetros de rota para consulta de URLs de um usuário específico.");
exports.CreateUrlSchemaStructure = zod_1.z.object({
    short_url: zod_1.z.string().describe("Código único gerado para a URL encurtada"),
});
exports.ErrorMessageSchema = zod_1.z.object({
    message: zod_1.z.string().describe("Mensagem explicativa sobre o erro ocorrido"),
});
exports.SuccessUrlResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseSuccessStructure), { data: zod_1.z.object({
        url: exports.CreateUrlSchemaStructure.describe("Código gerado para a URL encurtada"),
    }) }));
exports.SuccessUrlsResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseSuccessStructure), { data: exports.UrlPaginateResponseSchema }));
exports.ConfilitUrlResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseConflictStructure), { data: exports.ErrorMessageSchema }));
exports.NotFoundUrlResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseNotFoundStructure), { data: exports.ErrorMessageSchema }));
exports.BadRequestUrlResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseBadRequestStructure), { data: exports.ErrorMessageSchema }));
exports.UnauthorizedUrlResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseUnauthorizedStructure), { data: exports.ErrorMessageSchema }));
