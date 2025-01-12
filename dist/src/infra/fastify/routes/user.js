"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
exports.default = userRoutesFastify;
const _env_1 = __importDefault(require("../../../../env"));
const adpaters_1 = require("../../../presentation/adpaters");
const user_1 = require("../../fastify/schemas/user");
const validators_1 = require("../../../domain/validators");
const password_1 = require("../../providers/password");
const id_1 = require("../../providers/id");
const user_2 = require("../../../domain/usecases/user");
const user_3 = require("../../fastify/controllers/user");
const token_1 = require("../../providers/token");
const email_1 = require("../../../domain/usecases/email");
const nodemailer_1 = require("../../email/nodemailer");
const repositories_1 = require("../../../domain/repositories");
const middlewares_1 = require("../../middlewares");
const entities_1 = require("../../../domain/entities");
const userSequelizeRepository = new repositories_1.UserSequelizeRepository();
const userRedisRepository = new repositories_1.UserRedisRepository();
const verificationTokenSequelizeRepository = new repositories_1.VerificationTokenSequelizeRepository();
const verificationTokenRedisRepository = new repositories_1.VerificationTokenRedisRepository();
const userValidatorSimple = new validators_1.UserValidatorSimple();
const bcryptPasswordProvider = new password_1.BcryptPasswordProvider();
const cuid2IdProvider = new id_1.Cuid2IdProvider();
const userEmailVerification = new token_1.JwtToken({
    secret: _env_1.default.SECRET_KEY_TOKEN,
    expirationTime: _env_1.default.TOKEN_ACCOUNT_CONFIRMATION_DURATION,
});
const nodemailerSerivce = new nodemailer_1.NodemailerService();
const sendingEmailUserEmailConfirmationUseCase = new email_1.SendUserConfirmationEmailUseCase({
    emailService: nodemailerSerivce,
});
const sendingEmailUserRecoverPasswordUseCase = new email_1.SendUserRecoverPasswordUseCase({ emailService: nodemailerSerivce });
const registerUserUseCase = new user_2.RegisterUserUseCase({
    userRepository: userSequelizeRepository,
    userValidator: userValidatorSimple,
    passwordProvider: bcryptPasswordProvider,
    idProvider: cuid2IdProvider,
    tokenProvider: userEmailVerification,
    sendEmailUserEmailConfirmation: sendingEmailUserEmailConfirmationUseCase,
    sendEmail: entities_1.SendEmail.TRUE,
});
const loginUserUseCase = new user_2.LoginUserUseCase({
    userRepository: userSequelizeRepository,
    userMemoryRepository: userRedisRepository,
    passwordProvider: bcryptPasswordProvider,
    loginUserUseCaseConfig: { blockDuration: 300, maxLoginAttempts: 5 },
});
const confirmAccountUserUseCase = new user_2.ConfirmAccountUserUseCase({
    verificationTokenRepository: verificationTokenSequelizeRepository,
    userRepository: userSequelizeRepository,
});
const revalidateUserUseCase = new user_2.RevalidateUserUseCase();
const validateUserUseCase = new user_2.ValidateUserUseCase();
const sendConfirmationAccountUseCase = new user_2.SendConfirmationAccountUserUseCase({
    userRepository: userSequelizeRepository,
    verificationTokenMemoryRepository: verificationTokenRedisRepository,
    verificationTokenRepository: verificationTokenSequelizeRepository,
    idProvider: cuid2IdProvider,
    tokenProvider: userEmailVerification,
    sendEmailUserEmailConfirmation: sendingEmailUserEmailConfirmationUseCase,
    sendEmail: entities_1.SendEmail.TRUE,
});
const sendRecoverPasswordUseCase = new user_2.SendRecoverPasswordUserUseCase({
    userRepository: userSequelizeRepository,
    verificationTokenRepository: verificationTokenSequelizeRepository,
    verificationTokenMemoryRepository: verificationTokenRedisRepository,
    idProvider: cuid2IdProvider,
    tokenProvider: userEmailVerification,
    sendUserRecoverPasswordUseCase: sendingEmailUserRecoverPasswordUseCase,
    sendEmail: entities_1.SendEmail.TRUE,
});
const confirmRecoverPasswordUseCase = new user_2.ConfirmRecoverPasswordUserUseCase({
    verificationTokenRepository: verificationTokenSequelizeRepository,
    userRepository: userSequelizeRepository,
});
const recoverChangePasswordUseCase = new user_2.RecoverChangePasswordUseCase({
    userRepository: userSequelizeRepository,
    verificationTokenRepository: verificationTokenSequelizeRepository,
    passwordProvider: bcryptPasswordProvider,
});
const registerUserControllerFastify = new user_3.RegisterUserControllerFastify({ registerUserUseCase });
const confirmUserControllerFastify = new user_3.ConfirmAccountControllerFastify({ confirmAccountUserUseCase });
const loginUserControllerFastify = new user_3.LoginUserControllerFastify({ loginUserUseCase });
const validateUserControllerFasify = new user_3.ValidateUserControllerFastify({ validateUserUseCase });
const revalidateUserControllerFastify = new user_3.RevalidateUserControllerFastify({ revalidateUserUseCase });
const sendConfirmationAccountControllerFastify = new user_3.SendConfirmationAccountControllerFastify({
    sendConfirmationAccountUseCase,
});
const sendRecoverPasswordControllerFastify = new user_3.SendRecoverPasswordControllerFastify({ sendRecoverPasswordUseCase });
const confirmRecoverPasswordControllerFastify = new user_3.ConfirmRecoverPasswordControllerFastify({
    confirmRecoverPasswordUseCase,
});
const recoverChangePasswordControllerFastify = new user_3.RecoverChangePasswordControllerFastify({
    recoverChangePasswordUseCase,
});
exports.authMiddleware = new middlewares_1.AuthMiddleware({ userRepository: userSequelizeRepository });
function userRoutesFastify(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify
            .withTypeProvider()
            .post("/register", { schema: user_1.UserRegisterSchema }, (0, adpaters_1.fastifyAdapterRoute)(registerUserControllerFastify))
            .post("/confirm-account", {
            schema: user_1.AccountConfirmSchema,
        }, (0, adpaters_1.fastifyAdapterRoute)(confirmUserControllerFastify))
            .post("/login", {
            schema: user_1.UserLoginSchema,
        }, (0, adpaters_1.fastifyAdapterRoute)(loginUserControllerFastify))
            .get("/validate-user", { schema: user_1.UserValidateSchema }, (0, adpaters_1.fastifyAdapterRoute)(validateUserControllerFasify))
            .post("/revalidate-user", {
            schema: user_1.UserRevalidateSchema,
        }, (0, adpaters_1.fastifyAdapterRoute)(revalidateUserControllerFastify))
            .post("/send-confirmation-account", {
            schema: user_1.UserSendConfirmationAccountSchema,
        }, (0, adpaters_1.fastifyAdapterRoute)(sendConfirmationAccountControllerFastify))
            .post("/send-recover-password", {
            schema: user_1.UserSendRecoverPasswordSchema,
        }, (0, adpaters_1.fastifyAdapterRoute)(sendRecoverPasswordControllerFastify))
            .post("/confirm-recover-password", { schema: user_1.UserConfirmRecoverPasswordSchema }, (0, adpaters_1.fastifyAdapterRoute)(confirmRecoverPasswordControllerFastify))
            .post("/change-password", { schema: user_1.UserChangePasswordSchema }, (0, adpaters_1.fastifyAdapterRoute)(recoverChangePasswordControllerFastify));
    });
}
