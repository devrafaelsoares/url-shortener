import * as dotenv from "dotenv";
import { z } from "zod";
import { RED, BOLD, RESET } from "@/helpers/console/color";
import { MY_IP_ADDRESS } from "@/helpers";
import fs from "fs";
import path from "path";

dotenv.config();

const EnviromentMode = ["development", "production", "test"] as const;

const EnvironmentSchema = z.object({
    NODE_ENV: z
        .enum(EnviromentMode, {
            message: `Modo de ambiente inválido. Esperados ${EnviromentMode.join(" | ")}`,
        })
        .optional()
        .default("development"),
    APP_NAME: z.string({ required_error: "Configuração obrigatória" }),
    APP_DOMAIN: z.string({ required_error: "Configuração obrigatória" }),
    FASTIFY_HOST: z.string({ required_error: "Configuração obrigatória" }).default(MY_IP_ADDRESS),
    FASTIFY_PORT: z.string({ required_error: "Configuração obrigatória" }),
    DATABASE_USER: z.string({ required_error: "Configuração obrigatória" }),
    DATABASE_PASSWORD: z.string({ required_error: "Configuração obrigatória" }),
    DATABASE_HOST: z.string({ required_error: "Configuração obrigatória" }).default("localhost"),
    DATABASE_PORT: z.string({ required_error: "Configuração obrigatória" }).optional(),
    REDIS_HOST: z.string({ required_error: "Configuração obrigatória" }).default("127.0.0.1"),
    REDIS_PORT: z.coerce.number({ required_error: "Configuração obrigatória" }).optional(),
    REDIS_USERNAME: z.string({ required_error: "Configuração obrigatória" }),
    REDIS_PASSWORD: z.string({ required_error: "Configuração obrigatória" }),
    DATABASE_NAME: z.string({ required_error: "Configuração obrigatória" }),
    SECRET_KEY_TOKEN: z.string({ required_error: "Configuração obrigatória" }),
    ACCESS_PRIVATE_KEY_PATH: z.string({ required_error: "Configuração obrigatória" }),
    ACCESS_PUBLIC_KEY_PATH: z.string({ required_error: "Configuração obrigatória" }),
    REFRESH_PRIVATE_KEY_PATH: z.string({ required_error: "Configuração obrigatória" }),
    REFRESH_PUBLIC_KEY_PATH: z.string({ required_error: "Configuração obrigatória" }),
    TOKEN_DURATION: z.string({ required_error: "Configuração obrigatória" }),
    FASTIFY_SECRET_COOKIE: z.string({ required_error: "Configuração obrigatória" }),
    REFRESH_TOKEN_DURATION: z.string({
        required_error: "Configuração obrigatória",
    }),
    TOKEN_ACCOUNT_CONFIRMATION_DURATION: z.string({
        required_error: "Configuração obrigatória",
    }),
    VERIFICATION_TOKEN_RESEND_INTERVAL: z.string({
        required_error: "Configuração obrigatória",
    }),
    EMAIL_HOST: z.string({ required_error: "Configuração obrigatória" }),
    EMAIL_PORT: z.string({ required_error: "Configuração obrigatória" }),
    EMAIL_USERNAME: z.string({ required_error: "Configuração obrigatória" }),
    EMAIL_PASSWORD: z.string({ required_error: "Configuração obrigatória" }),
    EMAIL_FROM: z.string({ required_error: "Configuração obrigatória" }).email(),
    ARGON2_MEMORY_COST: z.coerce.number().optional().default(65536),
    ARGON2_TIME_COST: z.coerce.number().optional().default(3),
    ARGON2_PARALLELISM: z.coerce.number().optional().default(4),
    ARGON2_SECRET: z.string().optional(),
});

const envResult = EnvironmentSchema.safeParse(process.env);

if (!envResult.success) {
    console.error(`\n${RED}${BOLD}* Erro na inicialização da aplicação:${RESET}\n`);
    console.error(
        `${RED}Foram identificadas inconsistências nas variáveis de ambiente necessárias para o funcionamento do sistema.${RESET}\n`
    );
    console.error(`${RED}${BOLD}Variáveis: ${RESET}\n`);
    envResult.error.issues.forEach(issue => {
        const variable = issue.path.join(".");
        const message = issue.message;
        const value = process.env[variable] !== undefined ? process.env[variable] : "undefined";
        console.error(`${RED}- ${BOLD}${variable}: ${RESET}${RED}${message} (Valor fornecido: ${value})${RESET}`);
    });
    process.exit(1);
}

function loadKeyFile(keyPath: string, description: string): string {
    const resolvedPath = path.resolve(keyPath);
    try {
        return fs.readFileSync(resolvedPath, "utf-8");
    } catch {
        console.error(`${RED}${BOLD}Erro ao carregar chave: ${description}${RESET}`);
        console.error(`${RED}  Path: ${resolvedPath}${RESET}`);
        console.error(`${RED}  Execute: bash scripts/generate-keys.sh${RESET}`);
        process.exit(1);
    }
}

const env = envResult.data;

export const jwtKeys = {
    accessPrivateKey: loadKeyFile(env.ACCESS_PRIVATE_KEY_PATH, "Access Token Private Key"),
    accessPublicKey: loadKeyFile(env.ACCESS_PUBLIC_KEY_PATH, "Access Token Public Key"),
    refreshPrivateKey: loadKeyFile(env.REFRESH_PRIVATE_KEY_PATH, "Refresh Token Private Key"),
    refreshPublicKey: loadKeyFile(env.REFRESH_PUBLIC_KEY_PATH, "Refresh Token Public Key"),
} as const;

export default env;
