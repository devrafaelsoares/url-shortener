"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRevalidateRequestSchema = exports.UserLoginRequestSchema = exports.RecoverPasswordConfirmRequestSchema = exports.ChangePasswordRequestSchema = exports.AccountConfirmRequestSchema = exports.SendRecoverPasswordRequestSchema = exports.SendConfirmationAccountRequestSchema = exports.UserCreateRequestSchema = void 0;
const zod_1 = require("zod");
const baseUserSchema = {
    name: zod_1.z
        .string({ required_error: "É necessário informar o nome" })
        .min(4, "O nome deve ter pelo menos 4 caracteres.")
        .describe("Nome do usuário"),
    email: zod_1.z
        .string({
        required_error: "É necessário informar o email",
    })
        .email("Email informado é inválido")
        .describe("Email do usuário"),
    password: zod_1.z
        .string({ required_error: "É necessário informar a senha" })
        .min(8, "A senha deve ter no minímo oito caracteres")
        .describe("Senha do usuário"),
};
const baseConfirmationToken = {
    id: zod_1.z
        .string({ required_error: "É necessário informar o identificador do usuário" })
        .min(1, "É necessário informar o identificador do usuário")
        .describe("Identificador do usuário"),
    token: zod_1.z
        .string({
        required_error: "É necessário informar o token de confirmaçãoÉ necessário informar o token de confirmação",
    })
        .min(1, "")
        .describe("Token de confirmação"),
};
exports.UserCreateRequestSchema = zod_1.z.object(Object.assign({}, baseUserSchema));
exports.SendConfirmationAccountRequestSchema = zod_1.z.object({
    id: zod_1.z
        .string({ required_error: "É necessário informar o identificador do usuário" })
        .min(1, "É necessário informar o identificador do usuário")
        .describe("Identificador do usuário"),
});
exports.SendRecoverPasswordRequestSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "É necessário informar o email",
    })
        .min(1, "É necessário informar o email")
        .email("Email informado é inválido")
        .describe("Email do usuário"),
});
exports.AccountConfirmRequestSchema = zod_1.z.object(Object.assign({}, baseConfirmationToken));
exports.ChangePasswordRequestSchema = zod_1.z.object({
    user_id: zod_1.z
        .string({ required_error: "É necessário informar o identificador do usuário" })
        .min(1, "É necessário informar o identificador do usuário")
        .describe("Identificador do usuário"),
    token: zod_1.z
        .string({ required_error: "É necesário informar o token de confirmação" })
        .min(1, "É necesário informar o token de confirmação")
        .describe("Token de confirmação"),
    new_password: zod_1.z
        .string({
        required_error: "É necessário informar a nova senha",
    })
        .min(8, "A senha deve ter no mínimo oito caracteres")
        .describe("Nova senha"),
});
exports.RecoverPasswordConfirmRequestSchema = zod_1.z.object(Object.assign({}, baseConfirmationToken));
exports.UserLoginRequestSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "É necessário informar o email",
    })
        .email("Email informado é inválido")
        .describe("Email do usuário"),
    password: zod_1.z
        .string({ required_error: "É necessário informar o email" })
        .min(8, "A senha deve ter no minímo oito caracteres")
        .describe("Senha do usuário"),
});
exports.UserRevalidateRequestSchema = zod_1.z.object({
    refresh_token: zod_1.z
        .string({ required_error: "É necessário informar o token de atualização" })
        .min(1, "É necessário informar o token de atualização")
        .describe("Token de atualização"),
});
