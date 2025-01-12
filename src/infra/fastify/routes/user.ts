import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import env from "@env";
import { fastifyAdapterRoute } from "@presentation/adpaters";
import {
    AccountConfirmSchema,
    UserChangePasswordSchema,
    UserConfirmRecoverPasswordSchema,
    UserLoginSchema,
    UserRegisterSchema,
    UserRevalidateSchema,
    UserSendConfirmationAccountSchema,
    UserSendRecoverPasswordSchema,
    UserValidateSchema,
} from "@infra/fastify/schemas/user";
import { UserValidatorSimple } from "@domain/validators";
import { BcryptPasswordProvider } from "@infra/providers/password";
import { Cuid2IdProvider } from "@infra/providers/id";
import {
    ConfirmAccountUserUseCase,
    ConfirmRecoverPasswordUserUseCase,
    LoginUserUseCase,
    RecoverChangePasswordUseCase,
    RegisterUserUseCase,
    RevalidateUserUseCase,
    SendConfirmationAccountUserUseCase,
    SendRecoverPasswordUserUseCase,
    ValidateUserUseCase,
} from "@domain/usecases/user";
import {
    ConfirmAccountControllerFastify,
    RegisterUserControllerFastify,
    ValidateUserControllerFastify,
    ConfirmRecoverPasswordControllerFastify,
    LoginUserControllerFastify,
    RecoverChangePasswordControllerFastify,
    RevalidateUserControllerFastify,
    SendConfirmationAccountControllerFastify,
    SendRecoverPasswordControllerFastify,
} from "@infra/fastify/controllers/user";
import { JwtToken } from "@infra/providers/token";
import { SendUserConfirmationEmailUseCase, SendUserRecoverPasswordUseCase } from "@domain/usecases/email";
import { NodemailerService } from "@infra/email/nodemailer";
import {
    UserRedisRepository,
    UserSequelizeRepository,
    VerificationTokenRedisRepository,
    VerificationTokenSequelizeRepository,
} from "@domain/repositories";
import { AuthMiddleware } from "@infra/middlewares";
import { SendEmail } from "@domain/entities";

const userSequelizeRepository = new UserSequelizeRepository();
const userRedisRepository = new UserRedisRepository();
const verificationTokenSequelizeRepository = new VerificationTokenSequelizeRepository();
const verificationTokenRedisRepository = new VerificationTokenRedisRepository();
const userValidatorSimple = new UserValidatorSimple();
const bcryptPasswordProvider = new BcryptPasswordProvider();
const cuid2IdProvider = new Cuid2IdProvider();
const userEmailVerification = new JwtToken({
    secret: env.SECRET_KEY_TOKEN,
    expirationTime: env.TOKEN_ACCOUNT_CONFIRMATION_DURATION,
});
const nodemailerSerivce = new NodemailerService();

const sendingEmailUserEmailConfirmationUseCase = new SendUserConfirmationEmailUseCase({
    emailService: nodemailerSerivce,
});

const sendingEmailUserRecoverPasswordUseCase = new SendUserRecoverPasswordUseCase({ emailService: nodemailerSerivce });

const registerUserUseCase = new RegisterUserUseCase({
    userRepository: userSequelizeRepository,
    userValidator: userValidatorSimple,
    passwordProvider: bcryptPasswordProvider,
    idProvider: cuid2IdProvider,
    tokenProvider: userEmailVerification,
    sendEmailUserEmailConfirmation: sendingEmailUserEmailConfirmationUseCase,
    sendEmail: SendEmail.TRUE,
});

const loginUserUseCase = new LoginUserUseCase({
    userRepository: userSequelizeRepository,
    userMemoryRepository: userRedisRepository,
    passwordProvider: bcryptPasswordProvider,
    loginUserUseCaseConfig: { blockDuration: 300, maxLoginAttempts: 5 },
});

const confirmAccountUserUseCase = new ConfirmAccountUserUseCase({
    verificationTokenRepository: verificationTokenSequelizeRepository,
    userRepository: userSequelizeRepository,
});

const revalidateUserUseCase = new RevalidateUserUseCase();
const validateUserUseCase = new ValidateUserUseCase();

const sendConfirmationAccountUseCase = new SendConfirmationAccountUserUseCase({
    userRepository: userSequelizeRepository,
    verificationTokenMemoryRepository: verificationTokenRedisRepository,
    verificationTokenRepository: verificationTokenSequelizeRepository,
    idProvider: cuid2IdProvider,
    tokenProvider: userEmailVerification,
    sendEmailUserEmailConfirmation: sendingEmailUserEmailConfirmationUseCase,
    sendEmail: SendEmail.TRUE,
});

const sendRecoverPasswordUseCase = new SendRecoverPasswordUserUseCase({
    userRepository: userSequelizeRepository,
    verificationTokenRepository: verificationTokenSequelizeRepository,
    verificationTokenMemoryRepository: verificationTokenRedisRepository,
    idProvider: cuid2IdProvider,
    tokenProvider: userEmailVerification,
    sendUserRecoverPasswordUseCase: sendingEmailUserRecoverPasswordUseCase,
    sendEmail: SendEmail.TRUE,
});

const confirmRecoverPasswordUseCase = new ConfirmRecoverPasswordUserUseCase({
    verificationTokenRepository: verificationTokenSequelizeRepository,
    userRepository: userSequelizeRepository,
});

const recoverChangePasswordUseCase = new RecoverChangePasswordUseCase({
    userRepository: userSequelizeRepository,
    verificationTokenRepository: verificationTokenSequelizeRepository,
    passwordProvider: bcryptPasswordProvider,
});

const registerUserControllerFastify = new RegisterUserControllerFastify({ registerUserUseCase });
const confirmUserControllerFastify = new ConfirmAccountControllerFastify({ confirmAccountUserUseCase });
const loginUserControllerFastify = new LoginUserControllerFastify({ loginUserUseCase });
const validateUserControllerFasify = new ValidateUserControllerFastify({ validateUserUseCase });
const revalidateUserControllerFastify = new RevalidateUserControllerFastify({ revalidateUserUseCase });
const sendConfirmationAccountControllerFastify = new SendConfirmationAccountControllerFastify({
    sendConfirmationAccountUseCase,
});
const sendRecoverPasswordControllerFastify = new SendRecoverPasswordControllerFastify({ sendRecoverPasswordUseCase });
const confirmRecoverPasswordControllerFastify = new ConfirmRecoverPasswordControllerFastify({
    confirmRecoverPasswordUseCase,
});
const recoverChangePasswordControllerFastify = new RecoverChangePasswordControllerFastify({
    recoverChangePasswordUseCase,
});

export const authMiddleware = new AuthMiddleware({ userRepository: userSequelizeRepository });

export default async function userRoutesFastify(fastify: FastifyInstance) {
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post("/register", { schema: UserRegisterSchema }, fastifyAdapterRoute(registerUserControllerFastify))
        .post(
            "/confirm-account",
            {
                schema: AccountConfirmSchema,
            },
            fastifyAdapterRoute(confirmUserControllerFastify)
        )
        .post(
            "/login",
            {
                schema: UserLoginSchema,
            },
            fastifyAdapterRoute(loginUserControllerFastify)
        )

        .get("/validate-user", { schema: UserValidateSchema }, fastifyAdapterRoute(validateUserControllerFasify))
        .post(
            "/revalidate-user",
            {
                schema: UserRevalidateSchema,
            },
            fastifyAdapterRoute(revalidateUserControllerFastify)
        )
        .post(
            "/send-confirmation-account",
            {
                schema: UserSendConfirmationAccountSchema,
            },
            fastifyAdapterRoute(sendConfirmationAccountControllerFastify)
        )
        .post(
            "/send-recover-password",
            {
                schema: UserSendRecoverPasswordSchema,
            },
            fastifyAdapterRoute(sendRecoverPasswordControllerFastify)
        )
        .post(
            "/confirm-recover-password",
            { schema: UserConfirmRecoverPasswordSchema },
            fastifyAdapterRoute(confirmRecoverPasswordControllerFastify)
        )
        .post(
            "/change-password",
            { schema: UserChangePasswordSchema },
            fastifyAdapterRoute(recoverChangePasswordControllerFastify)
        );
}
