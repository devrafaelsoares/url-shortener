import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyRegisterOptions } from "fastify";
import env from "@env";

export const cookiesOptions: FastifyRegisterOptions<FastifyCookieOptions> = {
    secret: env.FASTIFY_SECRET_COOKIE,
    hook: "preHandler",
    parseOptions: {
        domain: env.APP_DOMAIN,
        sameSite: "lax",
        path: "/",
        secure: false,
    },
};
