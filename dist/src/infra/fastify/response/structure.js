"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseDeleteStructure = exports.ResponseForbiddenStructure = exports.ResponseUnauthorizedStructure = exports.ResponseInternalServerErroStructure = exports.ResponseGoneStructure = exports.ResponseConflictStructure = exports.ResponseBadRequestStructure = exports.ResponseNotFoundStructure = exports.ResponseSuccessStructure = void 0;
const zod_1 = require("zod");
exports.ResponseSuccessStructure = {
    success: zod_1.z.boolean().describe("Indica se a operação foi bem-sucedida"),
    moment: zod_1.z.coerce.date().describe("Timestamp da resposta"),
    status_code: zod_1.z.number().int().default(200).describe("Código de status HTTP da resposta"),
};
exports.ResponseNotFoundStructure = {
    success: zod_1.z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: zod_1.z.coerce.date().describe("Timestamp da resposta"),
    status_code: zod_1.z.number().int().default(404).describe("Código de status HTTP indicando o erro"),
};
exports.ResponseBadRequestStructure = {
    success: zod_1.z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: zod_1.z.coerce.date().describe("Timestamp da resposta"),
    status_code: zod_1.z.number().int().default(400).describe("Código de status HTTP indicando o erro"),
};
exports.ResponseConflictStructure = {
    success: zod_1.z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: zod_1.z.coerce.date().describe("Timestamp da resposta"),
    status_code: zod_1.z.number().int().default(409).describe("Código de status HTTP indicando o erro"),
};
exports.ResponseGoneStructure = {
    success: zod_1.z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: zod_1.z.coerce.date().describe("Timestamp da resposta"),
    status_code: zod_1.z.number().int().default(410).describe("Código de status HTTP indicando o erro"),
};
exports.ResponseInternalServerErroStructure = {
    success: zod_1.z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: zod_1.z.coerce.date().describe("Timestamp da resposta"),
    status_code: zod_1.z.number().int().default(500).describe("Código de status HTTP indicando o erro"),
};
exports.ResponseUnauthorizedStructure = {
    success: zod_1.z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: zod_1.z.coerce.date().describe("Timestamp da resposta"),
    status_code: zod_1.z.number().int().default(401).describe("Código de status HTTP indicando o erro"),
};
exports.ResponseForbiddenStructure = {
    success: zod_1.z.literal(false).describe("Indica que a operação não foi bem-sucedida"),
    moment: zod_1.z.coerce.date().describe("Timestamp da resposta"),
    status_code: zod_1.z.number().int().default(403).describe("Código de status HTTP indicando o erro"),
};
exports.ResponseDeleteStructure = {
    success: zod_1.z.boolean().describe("Indica se a operação foi bem-sucedida"),
    moment: zod_1.z.coerce.date().describe("Timestamp da resposta"),
    status_code: zod_1.z.number().int().default(204).describe("Código de status HTTP da resposta"),
};
