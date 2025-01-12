import fastifyStatic from "@fastify/static";
import fp from "fastify-plugin";
import path from "path";
import { FastifyInstance } from "fastify";

export default fp(async function (fastify: FastifyInstance) {
    fastify.register(fastifyStatic, {
        root: path.resolve("public"),
        prefixAvoidTrailingSlash: true,
    });
});
