import { z } from "zod";

export const ResponseSuccessStructure = {
    success: z.boolean().describe("Indica se a operação foi bem-sucedida"),
    moment: z.coerce.date().describe("Timestamp da resposta"),
    status_code: z.number().int().default(200).describe("Código de status HTTP da resposta"),
};

export const ResponseNotFoundStructure = {
    success: z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: z.coerce.date().describe("Timestamp da resposta"),

    status_code: z.number().int().default(404).describe("Código de status HTTP indicando o erro"),
};

export const ResponseBadRequestStructure = {
    success: z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: z.coerce.date().describe("Timestamp da resposta"),
    status_code: z.number().int().default(400).describe("Código de status HTTP indicando o erro"),
};

export const ResponseConflictStructure = {
    success: z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: z.coerce.date().describe("Timestamp da resposta"),
    status_code: z.number().int().default(409).describe("Código de status HTTP indicando o erro"),
};

export const ResponseGoneStructure = {
    success: z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: z.coerce.date().describe("Timestamp da resposta"),
    status_code: z.number().int().default(410).describe("Código de status HTTP indicando o erro"),
};

export const ResponseInternalServerErroStructure = {
    success: z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: z.coerce.date().describe("Timestamp da resposta"),
    status_code: z.number().int().default(500).describe("Código de status HTTP indicando o erro"),
};

export const ResponseUnauthorizedStructure = {
    success: z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: z.coerce.date().describe("Timestamp da resposta"),
    status_code: z.number().int().default(401).describe("Código de status HTTP indicando o erro"),
};

export const ResponseForbiddenStructure = {
    success: z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: z.coerce.date().describe("Timestamp da resposta"),
    status_code: z.number().int().default(403).describe("Código de status HTTP indicando o erro"),
};

export const ResponseDeleteStructure = {
    success: z.boolean().describe("Indica se a operação foi bem-sucedida"),
    moment: z.coerce.date().describe("Timestamp da resposta"),
    status_code: z.number().int().default(204).describe("Código de status HTTP da resposta"),
};
