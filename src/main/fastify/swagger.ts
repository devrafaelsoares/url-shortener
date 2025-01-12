import { SwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";

const theme = new SwaggerTheme();
const darkStyle = theme.getBuffer(SwaggerThemeNameEnum.DRACULA);

export const swaggerOptions: SwaggerOptions = {
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
    transform: jsonSchemaTransform,
};

export const swaggerUiOptions: FastifySwaggerUiOptions = {
    routePrefix: "/docs",
    theme: { title: "URL Shortener", css: [{ filename: "theme.css", content: darkStyle }] },
};
