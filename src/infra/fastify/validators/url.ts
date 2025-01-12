import { z } from "zod";
import {
    ResponseBadRequestStructure,
    ResponseConflictStructure,
    ResponseNotFoundStructure,
    ResponseSuccessStructure,
    ResponseUnauthorizedStructure,
} from "@infra/fastify/response/structure";
import { PaginateSchema } from "@infra/fastify/schemas/utils";

export const UrlResponseBodySchema = z.object({
    id: z.string().describe("Identificador único da URL no sistema."),
    original_url: z.string().url().describe("A URL original que foi encurtada. Deve ser uma URL válida."),
    short_url: z.string().describe("A URL encurtada gerada pelo sistema."),
    hit_count: z.coerce
        .number()
        .describe("Contagem de acessos à URL encurtada. É convertido para número, caso venha como string."),
    expires_at: z.date().nullable().describe("Data e hora de expiração da URL, ou `null` se não houver expiração."),
    created_at: z.date().describe("Data e hora de criação da URL no sistema."),
});

export const UrlCreateRequestBodySchema = z.object({
    original_url: z
        .string({ required_error: "É necessário informar o a url a se encurtada" })
        .min(1, "É necessário informar o a url a se encurtada")
        .url({ message: "URL informada é inválida" })
        .describe("URL original a ser encurtada."),
});

export const UrlPaginateQueryStringSchema = z
    .object({
        page: z.coerce.number().optional().describe("Número da página para consulta de URLs paginadas."),
        limit: z.coerce.number().optional().describe("Limite de itens por página para a consulta."),
    })
    .describe("Estrutura dos parâmetros de query string para consulta de URLs paginadas.");

export const UrlPaginateResponseSchema = PaginateSchema(UrlResponseBodySchema).describe(
    "Estrutura de resposta paginada contendo URLs encurtadas."
);

export const UrlPaginateParamsStringSchema = z
    .object({
        user_id: z.string().describe("Identificador único do usuário relacionado às URLs."),
    })
    .describe("Estrutura dos parâmetros de rota para consulta de URLs de um usuário específico.");

export const FindShortUrlParamsStringSchema = z
    .object({
        id: z
            .string()
            .describe("Identificador único da URL no sistema.")
            .min(1, "É necessário informar o identificador do usuário."),
    })
    .describe(
        "Estrutura dos parâmetros de rota para gerar ou consultar o código curto associado ao identificador único da URL no sistema."
    );

export const FindOriginalUrlParamsStringSchema = z
    .object({
        short_url: z.string().describe("Código curto gerado para identificar a URL encurtada."),
    })
    .describe("Estrutura dos parâmetros de rota para consulta de URLs de um usuário específico.");

export const CreateUrlSchemaStructure = z.object({
    short_url: z.string().describe("Código único gerado para a URL encurtada"),
});

export const ErrorMessageSchema = z.object({
    message: z.string().describe("Mensagem explicativa sobre o erro ocorrido"),
});

export const SuccessUrlResponseSchema = z.object({
    ...ResponseSuccessStructure,
    data: z.object({
        url: CreateUrlSchemaStructure.describe("Código gerado para a URL encurtada"),
    }),
});

export const SuccessUrlsResponseSchema = z.object({
    ...ResponseSuccessStructure,
    data: UrlPaginateResponseSchema,
});

export const ConfilitUrlResponseSchema = z.object({
    ...ResponseConflictStructure,
    data: ErrorMessageSchema,
});

export const NotFoundUrlResponseSchema = z.object({
    ...ResponseNotFoundStructure,
    data: ErrorMessageSchema,
});

export const BadRequestUrlResponseSchema = z.object({
    ...ResponseBadRequestStructure,
    data: ErrorMessageSchema,
});

export const UnauthorizedUrlResponseSchema = z.object({
    ...ResponseUnauthorizedStructure,
    data: ErrorMessageSchema,
});
