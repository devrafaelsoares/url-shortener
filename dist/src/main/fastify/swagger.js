"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUiOptions = exports.swaggerOptions = void 0;
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const swagger_themes_1 = require("swagger-themes");
const theme = new swagger_themes_1.SwaggerTheme();
const darkStyle = theme.getBuffer(swagger_themes_1.SwaggerThemeNameEnum.DRACULA);
exports.swaggerOptions = {
    swagger: {
        info: {
            title: "URL Shortener",
            description: "",
            version: "1.0.0",
            contact: {
                name: "devrafaelsoares",
                email: "contato.devrafaelsoares@gmail.com",
                url: "https://devrafaelsoares.com.br",
            },
        },
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
    },
    transform: fastify_type_provider_zod_1.jsonSchemaTransform,
};
exports.swaggerUiOptions = {
    routePrefix: "/docs",
    theme: { title: "URL Shortener", css: [{ filename: "theme.css", content: darkStyle }] },
};
