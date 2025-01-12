import { FastifyInstance, RegisterOptions } from "fastify";
import urlRoutes from "./url";
import userRoutes from "./user";

export default async function routes(fastify: FastifyInstance, options: RegisterOptions) {
    fastify.register(urlRoutes, options);
    fastify.register(userRoutes, options);
}
