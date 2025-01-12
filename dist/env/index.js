"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const zod_1 = require("zod");
const color_1 = require("../src/helpers/console/color");
const helpers_1 = require("../src/helpers");
dotenv.config();
const EnviromentMode = ["development", "production", "test"];
const EnvironmentSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(EnviromentMode, {
        message: `Modo de ambiente inválido. Esperados ${EnviromentMode.join(" | ")}`,
    })
        .optional()
        .default("development"),
    FASTIFY_HOST: zod_1.z.string({ required_error: "Configuração obrigatória" }).default(helpers_1.MY_IP_ADDRESS),
    FASTIFY_PORT: zod_1.z.string({ required_error: "Configuração obrigatória" }),
    DATABASE_USER: zod_1.z.string({ required_error: "Configuração obrigatória" }),
    DATABASE_PASSWORD: zod_1.z.string({ required_error: "Configuração obrigatória" }),
    DATABASE_HOST: zod_1.z.string({ required_error: "Configuração obrigatória" }).default("localhost"),
    DATABASE_PORT: zod_1.z.string({ required_error: "Configuração obrigatória" }).optional(),
    REDIS_HOST: zod_1.z.string({ required_error: "Configuração obrigatória" }).default("127.0.0.1"),
    REDIS_PORT: zod_1.z.coerce.number({ required_error: "Configuração obrigatória" }).optional(),
    REDIS_PASSWORD: zod_1.z.string({ required_error: "Configuração obrigatória" }),
    DATABASE_NAME: zod_1.z.string({ required_error: "Configuração obrigatória" }),
    SECRET_KEY_TOKEN: zod_1.z.string({ required_error: "Configuração obrigatória" }),
    SECRET_KEY_AUTH: zod_1.z.string({ required_error: "Configuração obrigatória" }),
    TOKEN_DURATION: zod_1.z.string({ required_error: "Configuração obrigatória" }),
    FASTIFY_SECRET_COOKIE: zod_1.z.string({ required_error: "Configuração obrigatória" }),
    REFRESH_TOKEN_DURATION: zod_1.z.string({
        required_error: "Configuração obrigatória",
    }),
    TOKEN_ACCOUNT_CONFIRMATION_DURATION: zod_1.z.string({
        required_error: "Configuração obrigatória",
    }),
    VERIFICATION_TOKEN_RESEND_INTERVAL: zod_1.z.string({
        required_error: "Configuração obrigatória",
    }),
});
const env = EnvironmentSchema.safeParse(process.env);
if (!env.success) {
    console.error(`\n${color_1.RED}${color_1.BOLD}* Erro na inicialização da aplicação:${color_1.RESET}\n`);
    console.error(`${color_1.RED}Foram identificadas inconsistências nas variáveis de ambiente necessárias para o funcionamento do sistema.${color_1.RESET}\n`);
    console.error(`${color_1.RED}${color_1.BOLD}Variáveis: ${color_1.RESET}\n`);
    env.error.issues.forEach(issue => {
        const variable = issue.path.join(".");
        const message = issue.message;
        const value = process.env[variable] !== undefined ? process.env[variable] : "undefined";
        console.error(`${color_1.RED}- ${color_1.BOLD}${variable}: ${color_1.RESET}${color_1.RED}${message} (Valor fornecido: ${value})${color_1.RESET}`);
    });
    process.exit(1);
}
exports.default = env.data;
