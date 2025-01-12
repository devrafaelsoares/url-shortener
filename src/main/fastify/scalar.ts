import { FastifyApiReferenceOptions } from "@scalar/fastify-api-reference";

export const scalarOptions: FastifyApiReferenceOptions = {
    routePrefix: "/reference",

    configuration: {
        metaData: {
            title: "URL Shortener Reference",
        },
        spec: {
            url: "/docs/json",
        },
    },
};
