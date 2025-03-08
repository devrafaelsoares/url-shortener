import path from "path";
import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import Autoload from "@fastify/autoload";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { errorHandler, setNotFoundHandler } from "./error-handler";
import { swaggerOptions, swaggerUiOptions } from "./swagger";
import { rateLimitOptions } from "./rate-limit";
import fastifyCookie from "@fastify/cookie";
import routes from "@infra/fastify/routes";
import { cookiesOptions } from "./cookie";
import { originsCors } from "./cors";

const app = fastify({ trustProxy: true });

app.register(Autoload, {
    dir: path.join(__dirname, "plugins"),
});

app.register(cors, {
    origin: originsCors,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
});
app.setErrorHandler(errorHandler);

setNotFoundHandler(app);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(rateLimit, rateLimitOptions);
app.register(swagger, swaggerOptions);
app.register(swaggerUI, swaggerUiOptions);

app.register(fastifyCookie, cookiesOptions);

app.register(routes);

export default app;
