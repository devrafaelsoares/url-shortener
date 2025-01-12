import { FastifySchema } from "fastify";
import {
    BadRequestUrlResponseSchema,
    ConfilitUrlResponseSchema,
    FindOriginalUrlParamsStringSchema,
    FindShortUrlParamsStringSchema,
    NotFoundUrlResponseSchema,
    SuccessUrlResponseSchema,
    SuccessUrlsResponseSchema,
    UnauthorizedUrlResponseSchema,
    UrlCreateRequestBodySchema,
    UrlPaginateParamsStringSchema,
    UrlPaginateQueryStringSchema,
} from "@infra/fastify/validators/url";

export const CreateUrlSchema: FastifySchema = {
    description: "Criação de uma URL encurtada a partir de uma URL original.",
    tags: ["URL"],
    body: UrlCreateRequestBodySchema,
    response: {
        201: SuccessUrlResponseSchema.describe("URL encurtada criada com sucesso e disponível para uso."),
        401: UnauthorizedUrlResponseSchema.describe("Usuário não autorizado a realizar a operação."),
        404: NotFoundUrlResponseSchema.describe("Usuário não encontrado no sistema."),
        409: ConfilitUrlResponseSchema.describe("A URL encurtada já está registrada no sistema."),
    },
};

export const FindShortUrlSchema: FastifySchema = {
    description: "Recupera o código da URL encurtada associada a URL original.",
    tags: ["URL"],
    response: {
        404: NotFoundUrlResponseSchema.describe(
            "O código fornecido não corresponde a nenhuma URL encurtada existente."
        ),
    },
    params: FindShortUrlParamsStringSchema.describe(
        "Parâmetros de rota contendo a URL original para busca do código curto associado."
    ),
};

export const FindOriginalUrlSchema: FastifySchema = {
    description: "Recupera a URL original associada ao identificador do registro.",
    tags: ["URL"],
    response: {
        404: NotFoundUrlResponseSchema.describe(
            "O código fornecido não corresponde a nenhuma URL encurtada existente."
        ),
    },
    params: FindOriginalUrlParamsStringSchema.describe(
        "Parâmetros de rota, onde o código da URL encurtada será utilizado para recuperar a URL original associada."
    ),
};

export const FindAllUrlsSchema: FastifySchema = {
    description: "Recupera a URL original associada ao identificador do registro.",
    tags: ["URL"],
    response: {
        200: SuccessUrlsResponseSchema.describe(
            "Resposta com sucesso, contendo a URL original. O código fornecido não corresponde a nenhuma URL encurtada existente."
        ),
        400: BadRequestUrlResponseSchema.describe(
            "O número da página deve ser maior ou igual a 1. Verifique o valor da página fornecido."
        ),
        404: NotFoundUrlResponseSchema.describe("Usuário não encontrado no sistema."),
    },
    querystring: UrlPaginateQueryStringSchema.describe(
        "Parâmetros de consulta para paginar a lista de URLs encurtadas."
    ),
    params: UrlPaginateParamsStringSchema.describe(
        "Parâmetros de rota, incluindo o identificador do usuário para recuperar suas URLs."
    ),
};
