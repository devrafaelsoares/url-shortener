import { SwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";

import env from "@env";

const theme = new SwaggerTheme();
const darkStyle = theme.getBuffer(SwaggerThemeNameEnum.DRACULA);

export const swaggerOptions: SwaggerOptions = {
    openapi: {
        openapi: "3.0.0",
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
        servers: [
            {
                url: env.NODE_ENV === "production" ? `https://${env.APP_DOMAIN.replace(/^https?:\/\//, "")}` : "http://192.168.3.202:8080",
                description: env.NODE_ENV === "production" ? "Production Server" : "Development Server"
            }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "API_AUTH",
                    description: "Cookie HttpOnly de Autenticação gerado no Login",
                },
            },
        },
        security: [
            {
                cookieAuth: [],
            },
        ],
    },

    transform: jsonSchemaTransform,
};

export const swaggerUiOptions: FastifySwaggerUiOptions = {
    routePrefix: "/docs",
    theme: { title: "URL Shortener", css: [{ filename: "theme.css", content: darkStyle }] },
    uiConfig: {
        withCredentials: true,
    },
};
