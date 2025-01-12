import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyRegisterOptions } from "fastify";
import env from "@env";

export const cookiesOptions: FastifyRegisterOptions<FastifyCookieOptions> = {
    secret: env.FASTIFY_SECRET_COOKIE,
    hook: "preHandler",
    parseOptions: {
        domain: "192.168.100.6",
        sameSite: "lax",
        path: "/",
        secure: false,
    },
};