import { z } from "zod";
import {
    ResponseBadRequestStructure,
    ResponseConflictStructure,
    ResponseForbiddenStructure,
    ResponseGoneStructure,
    ResponseNotFoundStructure,
    ResponseSuccessStructure,
    ResponseUnauthorizedStructure,
} from "@infra/fastify/response/structure";
import { FastifySchema } from "fastify";
import {
    AccountConfirmRequestSchema,
    UserCreateRequestSchema,
    UserLoginRequestSchema,
    SendConfirmationAccountRequestSchema,
    UserRevalidateRequestSchema,
    SendRecoverPasswordRequestSchema,
    RecoverPasswordConfirmRequestSchema,
    ChangePasswordRequestSchema,
} from "@infra/fastify/validators/user";

export const UserStructureSchema = z.object({
    id: z.string().cuid2().describe("Identificador único do usuário no sistema."),
    name: z.string().describe("Nome completo do usuário."),
    email: z.string().email().describe("Endereço de e-mail associado ao usuário."),
    created_at: z.coerce.date().describe("Data e hora em que o usuário foi registrado."),
});

export const UserCreateStructureSchema = z.object({
    id: z.string().cuid2().describe("Identificador único do usuário no sistema."),
    token: z.string().describe("Token de acesso gerado para o usuário."),
});

export const UserLoginResponseStructureSchema = z.object({
    user_id: z.string().cuid2().describe("Identificador único do usuário."),
    token: z.string().describe("Token de acesso gerado para o usuário."),
    refresh_token: z.string().describe("Token de renovação para manter a sessão do usuário."),
});

export const UserValidateResponseSchema = z.object({
    token: z
        .object({
            valid: z.boolean().describe("Indica se o token fornecido é válido."),
        })
        .describe("Informações sobre a validade do token do usuário."),
});

const ErrorMessageSchema = z.object({
    message: z.string().describe("Mensagem detalhada explicando o erro ocorrido."),
});

const SuccessUserResponseSchema = z.object({
    ...ResponseSuccessStructure,
    data: z.object({
        user: UserCreateStructureSchema.describe("Dados detalhados do usuário registrado."),
    }),
});

const SuccessSendRecoverPasswordResponseSchema = z.object({
    ...ResponseSuccessStructure,
    data: z.object({
        message: z.string().describe("Mensagem inidicando que o email de alteração de senha foi enviado"),
    }),
});

const SuccessSendConfirmationAccountResponseSchema = z.object({
    ...ResponseSuccessStructure,
    data: z.object({
        message: z.string().describe("Mensagem inidicando que o email de confirmação da conta foi enviado"),
    }),
});

const SuccessAccountConfirmResponseSchema = z.object({
    ...ResponseSuccessStructure,
    data: z.object({
        message: z.string().describe("Mensagem de confirmação de ativação do usuário."),
    }),
});

const SuccessChangePasswordResponseSchema = z.object({
    ...ResponseSuccessStructure,
    data: z.object({
        message: z.string().describe("Mensagem indicando o sucesso na alteração de senha."),
    }),
});

const SuccessRecoverPasswordConfirmResponseSchema = z.object({
    ...ResponseSuccessStructure,
    data: z.null().describe("Nenhum dado adicional retornado na confirmação da alteração de senha."),
});

const SuccessUserLoginResponseSchema = z.object({
    ...ResponseSuccessStructure,
    data: UserLoginResponseStructureSchema,
});

const SuccessUserValidateResponseSchema = z.object({
    ...ResponseSuccessStructure,
    data: UserValidateResponseSchema,
});

const SuccessUserRevalidateResponseSchema = z.object({
    ...ResponseSuccessStructure,
    data: z.string().describe("Token atualizado após a revalidação do usuário."),
});

const ConflictUserResponseSchema = z.object({
    ...ResponseConflictStructure,
    data: ErrorMessageSchema,
});

const UnauthorizedUserResponseSchema = z.object({
    ...ResponseUnauthorizedStructure,
    data: ErrorMessageSchema,
});

const ForbiddenUserResponseSchema = z.object({
    ...ResponseForbiddenStructure,
    data: ErrorMessageSchema,
});

export const NotFoundUserResponseSchema = z.object({
    ...ResponseNotFoundStructure,
    data: ErrorMessageSchema,
});

const GoneUserResponseSchema = z.object({
    ...ResponseGoneStructure,
    data: ErrorMessageSchema,
});

const BadRequestUserMessageResponseSchema = z.object({
    ...ResponseBadRequestStructure,
    data: ErrorMessageSchema,
});

const BadRequestUserErrorsResponseSchema = z.object({
    ...ResponseBadRequestStructure,
    data: z.object({
        errors: z
            .array(
                z.object({
                    path: z.string().describe("Campo que apresentou erro de validação."),
                    message: z.string().describe("Descrição detalhada do problema ocorrido no campo."),
                })
            )
            .describe("Lista de erros de validação nos campos do formulário."),
    }),
});

export const UserRegisterSchema: FastifySchema = {
    description: "Registra um novo usuário no sistema.",
    tags: ["User"],
    body: UserCreateRequestSchema,
    response: {
        200: SuccessUserResponseSchema.describe("Usuário registrado com sucesso no sistema."),
        400: BadRequestUserErrorsResponseSchema.describe("Erro de validação durante o registro do usuário."),
        409: ConflictUserResponseSchema.describe("Usuário já registrado no sistema."),
    },
};

export const UserSendConfirmationAccountSchema: FastifySchema = {
    description: "Solicita o envio de um e-mail de confirmação para ativar a conta do usuário.",
    tags: ["User"],
    body: SendConfirmationAccountRequestSchema,
    response: {
        200: SuccessSendConfirmationAccountResponseSchema.describe("Solicitação de confirmação enviada com sucesso."),
        400: BadRequestUserMessageResponseSchema.describe(
            "Erroao enviar uma nova solicitação. É necessário aguarda o tempo informado."
        ),
    },
};

export const UserSendRecoverPasswordSchema: FastifySchema = {
    description: "Solicita o envio de um e-mail para recuperação de senha.",
    tags: ["User"],
    body: SendRecoverPasswordRequestSchema,
    response: {
        200: SuccessSendRecoverPasswordResponseSchema.describe(
            "Solicitação de recuperação de senha enviada com sucesso."
        ),
        400: BadRequestUserMessageResponseSchema.describe(
            "Erroao enviar uma nova solicitação. É necessário aguarda o tempo informado."
        ),
    },
};

export const UserConfirmRecoverPasswordSchema: FastifySchema = {
    description: "Confirma a alteração da senha do usuário através de um token de validação.",
    tags: ["User"],
    body: AccountConfirmRequestSchema,
    response: {
        200: SuccessRecoverPasswordConfirmResponseSchema.describe("Alteração de senha confirmada com sucesso."),
        400: BadRequestUserMessageResponseSchema.describe("Erro de validação ao confirmar a alteração de senha."),
        404: NotFoundUserResponseSchema.describe("Usuário ou token de confirmação não encontrados no sistema."),
        500: ConflictUserResponseSchema.describe("Erro inesperado ao confirmar a alteração de senha."),
    },
};

export const UserChangePasswordSchema: FastifySchema = {
    description: "Permite a alteração da senha do usuário autenticado.",
    tags: ["User"],
    body: ChangePasswordRequestSchema,
    response: {
        200: SuccessChangePasswordResponseSchema.describe("Senha alterada com sucesso."),
        404: NotFoundUserResponseSchema.describe("Usuário ou token de validação não encontrados no sistema."),
    },
};

export const AccountConfirmSchema: FastifySchema = {
    description: "Confirma o cadastro do usuário através de um token de ativação.",
    tags: ["User"],
    body: RecoverPasswordConfirmRequestSchema,
    response: {
        200: SuccessAccountConfirmResponseSchema.describe("Cadastro do usuário confirmado com sucesso."),
        400: BadRequestUserMessageResponseSchema.describe("Erro de validação ao confirmar o cadastro do usuário."),
        401: UnauthorizedUserResponseSchema.describe("Usuário não autorizado a realizar a operação."),
        404: NotFoundUserResponseSchema.describe("Usuário ou token de ativação não encontrados."),
        410: GoneUserResponseSchema.describe("Usuário já ativado anteriormente."),
        500: ConflictUserResponseSchema.describe("Erro inesperado durante a confirmação do cadastro."),
    },
};

export const UserLoginSchema: FastifySchema = {
    description: "Realiza a autenticação do usuário no sistema, gerando tokens de acesso.",
    tags: ["User"],
    body: UserLoginRequestSchema,
    response: {
        200: SuccessUserLoginResponseSchema.describe("Autenticação realizada com sucesso."),
        401: UnauthorizedUserResponseSchema.describe("Credenciais inválidas, como usuário ou senha incorretos."),
        403: ForbiddenUserResponseSchema.describe("Credenciais inválidas, como usuário ou senha incorretos."),
    },
};

export const UserValidateSchema: FastifySchema = {
    description: "Verifica se o token de autenticação do usuário ainda é válido.",
    tags: ["User"],
    response: {
        200: SuccessUserValidateResponseSchema.describe("Token validado com sucesso."),
        401: UnauthorizedUserResponseSchema.describe("Token inválido ou expirado."),
    },
};

export const UserRevalidateSchema: FastifySchema = {
    description: "Renova o token de autenticação do usuário para prolongar a sessão.",
    tags: ["User"],
    body: UserRevalidateRequestSchema,
    response: {
        200: SuccessUserRevalidateResponseSchema.describe("Token renovado com sucesso."),
        401: UnauthorizedUserResponseSchema.describe("Token inválido ou expirado, impossibilitando a renovação."),
    },
};
