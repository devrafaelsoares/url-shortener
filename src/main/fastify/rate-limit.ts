import { RateLimitPluginOptions } from "@fastify/rate-limit";
import Redis from "ioredis";
import env from "@env";

export const rateLimitOptions: RateLimitPluginOptions = {
    timeWindow: 1 * 60 * 1000,
    max: 100,
    nameSpace: "rate_limit:ip:",
    redis: new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
    }),
};
