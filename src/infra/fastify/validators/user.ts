import { z } from "zod";

const baseUserSchema = {
    name: z
        .string({ required_error: "É necessário informar o nome" })
        .min(4, "O nome deve ter pelo menos 4 caracteres.")
        .describe("Nome do usuário"),
    email: z
        .string({
            required_error: "É necessário informar o email",
        })
        .email("Email informado é inválido")
        .describe("Email do usuário"),
    password: z
        .string({ required_error: "É necessário informar a senha" })
        .min(8, "A senha deve ter no minímo oito caracteres")
        .describe("Senha do usuário"),
};

const baseConfirmationToken = {
    id: z
        .string({ required_error: "É necessário informar o identificador do usuário" })
        .min(1, "É necessário informar o identificador do usuário")
        .describe("Identificador do usuário"),
    token: z
        .string({
            required_error: "É necessário informar o token de confirmaçãoÉ necessário informar o token de confirmação",
        })
        .min(1, "")
        .describe("Token de confirmação"),
};

export const UserCreateRequestSchema = z.object({
    ...baseUserSchema,
});

export const SendConfirmationAccountRequestSchema = z.object({
    id: z
        .string({ required_error: "É necessário informar o identificador do usuário" })
        .min(1, "É necessário informar o identificador do usuário")
        .describe("Identificador do usuário"),
});

export const SendRecoverPasswordRequestSchema = z.object({
    email: z
        .string({
            required_error: "É necessário informar o email",
        })
        .min(1, "É necessário informar o email")
        .email("Email informado é inválido")
        .describe("Email do usuário"),
});

export const AccountConfirmRequestSchema = z.object({
    ...baseConfirmationToken,
});

export const ChangePasswordRequestSchema = z.object({
    user_id: z
        .string({ required_error: "É necessário informar o identificador do usuário" })
        .min(1, "É necessário informar o identificador do usuário")
        .describe("Identificador do usuário"),
    token: z
        .string({ required_error: "É necesário informar o token de confirmação" })
        .min(1, "É necesário informar o token de confirmação")
        .describe("Token de confirmação"),

    new_password: z
        .string({
            required_error: "É necessário informar a nova senha",
        })
        .min(8, "A senha deve ter no mínimo oito caracteres")
        .describe("Nova senha"),
});

export const RecoverPasswordConfirmRequestSchema = z.object({
    ...baseConfirmationToken,
});

export const UserLoginRequestSchema = z.object({
    email: z
        .string({
            required_error: "É necessário informar o email",
        })
        .email("Email informado é inválido")
        .describe("Email do usuário"),
    password: z
        .string({ required_error: "É necessário informar o email" })
        .min(8, "A senha deve ter no minímo oito caracteres")
        .describe("Senha do usuário"),
});

export const UserRevalidateRequestSchema = z.object({
    refresh_token: z
        .string({ required_error: "É necessário informar o token de atualização" })
        .min(1, "É necessário informar o token de atualização")
        .describe("Token de atualização"),
});
