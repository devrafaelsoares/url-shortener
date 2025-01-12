"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRevalidateSchema = exports.UserValidateSchema = exports.UserLoginSchema = exports.AccountConfirmSchema = exports.UserChangePasswordSchema = exports.UserConfirmRecoverPasswordSchema = exports.UserSendRecoverPasswordSchema = exports.UserSendConfirmationAccountSchema = exports.UserRegisterSchema = exports.NotFoundUserResponseSchema = exports.UserValidateResponseSchema = exports.UserLoginResponseStructureSchema = exports.UserCreateStructureSchema = exports.UserStructureSchema = void 0;
const zod_1 = require("zod");
const structure_1 = require("../../fastify/response/structure");
const user_1 = require("../../fastify/validators/user");
exports.UserStructureSchema = zod_1.z.object({
    id: zod_1.z.string().cuid2().describe("Identificador único do usuário no sistema."),
    name: zod_1.z.string().describe("Nome completo do usuário."),
    email: zod_1.z.string().email().describe("Endereço de e-mail associado ao usuário."),
    created_at: zod_1.z.coerce.date().describe("Data e hora em que o usuário foi registrado."),
});
exports.UserCreateStructureSchema = zod_1.z.object({
    id: zod_1.z.string().cuid2().describe("Identificador único do usuário no sistema."),
    token: zod_1.z.string().describe("Token de acesso gerado para o usuário."),
});
exports.UserLoginResponseStructureSchema = zod_1.z.object({
    user_id: zod_1.z.string().cuid2().describe("Identificador único do usuário."),
    token: zod_1.z.string().describe("Token de acesso gerado para o usuário."),
    refresh_token: zod_1.z.string().describe("Token de renovação para manter a sessão do usuário."),
});
exports.UserValidateResponseSchema = zod_1.z.object({
    token: zod_1.z
        .object({
        valid: zod_1.z.boolean().describe("Indica se o token fornecido é válido."),
    })
        .describe("Informações sobre a validade do token do usuário."),
});
const ErrorMessageSchema = zod_1.z.object({
    message: zod_1.z.string().describe("Mensagem detalhada explicando o erro ocorrido."),
});
const SuccessUserResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseSuccessStructure), { data: zod_1.z.object({
        user: exports.UserCreateStructureSchema.describe("Dados detalhados do usuário registrado."),
    }) }));
const SuccessSendRecoverPasswordResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseSuccessStructure), { data: zod_1.z.object({
        message: zod_1.z.string().describe("Mensagem inidicando que o email de alteração de senha foi enviado"),
    }) }));
const SuccessSendConfirmationAccountResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseSuccessStructure), { data: zod_1.z.object({
        message: zod_1.z.string().describe("Mensagem inidicando que o email de confirmação da conta foi enviado"),
    }) }));
const SuccessAccountConfirmResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseSuccessStructure), { data: zod_1.z.object({
        message: zod_1.z.string().describe("Mensagem de confirmação de ativação do usuário."),
    }) }));
const SuccessChangePasswordResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseSuccessStructure), { data: zod_1.z.object({
        message: zod_1.z.string().describe("Mensagem indicando o sucesso na alteração de senha."),
    }) }));
const SuccessRecoverPasswordConfirmResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseSuccessStructure), { data: zod_1.z.null().describe("Nenhum dado adicional retornado na confirmação da alteração de senha.") }));
const SuccessUserLoginResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseSuccessStructure), { data: exports.UserLoginResponseStructureSchema }));
const SuccessUserValidateResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseSuccessStructure), { data: exports.UserValidateResponseSchema }));
const SuccessUserRevalidateResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseSuccessStructure), { data: zod_1.z.string().describe("Token atualizado após a revalidação do usuário.") }));
const ConflictUserResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseConflictStructure), { data: ErrorMessageSchema }));
const UnauthorizedUserResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseUnauthorizedStructure), { data: ErrorMessageSchema }));
const ForbiddenUserResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseForbiddenStructure), { data: ErrorMessageSchema }));
exports.NotFoundUserResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseNotFoundStructure), { data: ErrorMessageSchema }));
const GoneUserResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseGoneStructure), { data: ErrorMessageSchema }));
const BadRequestUserMessageResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseBadRequestStructure), { data: ErrorMessageSchema }));
const BadRequestUserErrorsResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, structure_1.ResponseBadRequestStructure), { data: zod_1.z.object({
        errors: zod_1.z
            .array(zod_1.z.object({
            path: zod_1.z.string().describe("Campo que apresentou erro de validação."),
            message: zod_1.z.string().describe("Descrição detalhada do problema ocorrido no campo."),
        }))
            .describe("Lista de erros de validação nos campos do formulário."),
    }) }));
exports.UserRegisterSchema = {
    description: "Registra um novo usuário no sistema.",
    tags: ["User"],
    body: user_1.UserCreateRequestSchema,
    response: {
        200: SuccessUserResponseSchema.describe("Usuário registrado com sucesso no sistema."),
        400: BadRequestUserErrorsResponseSchema.describe("Erro de validação durante o registro do usuário."),
        409: ConflictUserResponseSchema.describe("Usuário já registrado no sistema."),
    },
};
exports.UserSendConfirmationAccountSchema = {
    description: "Solicita o envio de um e-mail de confirmação para ativar a conta do usuário.",
    tags: ["User"],
    body: user_1.SendConfirmationAccountRequestSchema,
    response: {
        200: SuccessSendConfirmationAccountResponseSchema.describe("Solicitação de confirmação enviada com sucesso."),
        400: BadRequestUserMessageResponseSchema.describe("Erroao enviar uma nova solicitação. É necessário aguarda o tempo informado."),
    },
};
exports.UserSendRecoverPasswordSchema = {
    description: "Solicita o envio de um e-mail para recuperação de senha.",
    tags: ["User"],
    body: user_1.SendRecoverPasswordRequestSchema,
    response: {
        200: SuccessSendRecoverPasswordResponseSchema.describe("Solicitação de recuperação de senha enviada com sucesso."),
        400: BadRequestUserMessageResponseSchema.describe("Erroao enviar uma nova solicitação. É necessário aguarda o tempo informado."),
    },
};
exports.UserConfirmRecoverPasswordSchema = {
    description: "Confirma a alteração da senha do usuário através de um token de validação.",
    tags: ["User"],
    body: user_1.AccountConfirmRequestSchema,
    response: {
        200: SuccessRecoverPasswordConfirmResponseSchema.describe("Alteração de senha confirmada com sucesso."),
        400: BadRequestUserMessageResponseSchema.describe("Erro de validação ao confirmar a alteração de senha."),
        404: exports.NotFoundUserResponseSchema.describe("Usuário ou token de confirmação não encontrados no sistema."),
        500: ConflictUserResponseSchema.describe("Erro inesperado ao confirmar a alteração de senha."),
    },
};
exports.UserChangePasswordSchema = {
    description: "Permite a alteração da senha do usuário autenticado.",
    tags: ["User"],
    body: user_1.ChangePasswordRequestSchema,
    response: {
        200: SuccessChangePasswordResponseSchema.describe("Senha alterada com sucesso."),
        404: exports.NotFoundUserResponseSchema.describe("Usuário ou token de validação não encontrados no sistema."),
    },
};
exports.AccountConfirmSchema = {
    description: "Confirma o cadastro do usuário através de um token de ativação.",
    tags: ["User"],
    body: user_1.RecoverPasswordConfirmRequestSchema,
    response: {
        200: SuccessAccountConfirmResponseSchema.describe("Cadastro do usuário confirmado com sucesso."),
        400: BadRequestUserMessageResponseSchema.describe("Erro de validação ao confirmar o cadastro do usuário."),
        401: UnauthorizedUserResponseSchema.describe("Usuário não autorizado a realizar a operação."),
        404: exports.NotFoundUserResponseSchema.describe("Usuário ou token de ativação não encontrados."),
        410: GoneUserResponseSchema.describe("Usuário já ativado anteriormente."),
        500: ConflictUserResponseSchema.describe("Erro inesperado durante a confirmação do cadastro."),
    },
};
exports.UserLoginSchema = {
    description: "Realiza a autenticação do usuário no sistema, gerando tokens de acesso.",
    tags: ["User"],
    body: user_1.UserLoginRequestSchema,
    response: {
        200: SuccessUserLoginResponseSchema.describe("Autenticação realizada com sucesso."),
        401: UnauthorizedUserResponseSchema.describe("Credenciais inválidas, como usuário ou senha incorretos."),
        403: ForbiddenUserResponseSchema.describe("Credenciais inválidas, como usuário ou senha incorretos."),
    },
};
exports.UserValidateSchema = {
    description: "Verifica se o token de autenticação do usuário ainda é válido.",
    tags: ["User"],
    response: {
        200: SuccessUserValidateResponseSchema.describe("Token validado com sucesso."),
        401: UnauthorizedUserResponseSchema.describe("Token inválido ou expirado."),
    },
};
exports.UserRevalidateSchema = {
    description: "Renova o token de autenticação do usuário para prolongar a sessão.",
    tags: ["User"],
    body: user_1.UserRevalidateRequestSchema,
    response: {
        200: SuccessUserRevalidateResponseSchema.describe("Token renovado com sucesso."),
        401: UnauthorizedUserResponseSchema.describe("Token inválido ou expirado, impossibilitando a renovação."),
    },
};
