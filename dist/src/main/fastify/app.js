"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fastify_1 = __importDefault(require("fastify"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const fastify_api_reference_1 = __importDefault(require("@scalar/fastify-api-reference"));
const autoload_1 = __importDefault(require("@fastify/autoload"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const error_handler_1 = require("./error-handler");
const swagger_2 = require("./swagger");
const rate_limit_2 = require("./rate-limit");
const cookie_1 = __importDefault(require("@fastify/cookie"));
const routes_1 = __importDefault(require("../../infra/fastify/routes"));
const cookie_2 = require("./cookie");
const cors_2 = require("./cors");
const scalar_1 = require("./scalar");
const app = (0, fastify_1.default)({ trustProxy: true });
app.register(autoload_1.default, {
    dir: path_1.default.join(__dirname, "plugins"),
});
app.register(cors_1.default, {
    origin: cors_2.originsCors,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
});
app.setErrorHandler(error_handler_1.errorHandler);
(0, error_handler_1.setNotFoundHandler)(app);
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.register(rate_limit_1.default, rate_limit_2.rateLimitOptions);
app.register(swagger_1.default, swagger_2.swaggerOptions);
app.register(swagger_ui_1.default, swagger_2.swaggerUiOptions);
app.register(fastify_api_reference_1.default, scalar_1.scalarOptions);
app.register(cookie_1.default, cookie_2.cookiesOptions);
app.register(routes_1.default);
exports.default = app;
