import { FastifyCookieOptions } from "@fastify/cookie";
import env from "@env";

const isProduction = env.NODE_ENV === "production";

export const cookiesOptions: FastifyCookieOptions = {
    secret: env.FASTIFY_SECRET_COOKIE,
    parseOptions: {
        domain: isProduction ? env.APP_DOMAIN : undefined,
        sameSite: "strict",
        path: "/",
        secure: isProduction,
        httpOnly: true,
    },
};
