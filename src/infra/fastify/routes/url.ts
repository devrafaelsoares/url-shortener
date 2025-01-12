import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { fastifyAdapterRoute } from "@presentation/adpaters";
import { UrlLogValidatorSimple, UrlValidatorSimple } from "@domain/validators";
import { Cuid2IdProvider, UuidV4IdProvider } from "@infra/providers/id";
import {
    UrlLogSequelizeRepository,
    UrlRedisRepository,
    UrlSequelizeRepository,
    UserSequelizeRepository,
} from "@domain/repositories";
import {
    CreateShortUrlUseCase,
    FindAllUrlsByUserUseCase,
    FindOriginalUrlUseCase,
    FindShortUrlUseCase,
} from "@domain/usecases/url";
import { ToBase62 } from "@infra/providers/to-base";
import {
    CreateShortUrlControllerFastify,
    FindAllUrlsByUserControllerFastify,
    FindOriginalUrlControllerFastify,
    FindShortUrlControllerFastify,
} from "@infra/fastify/controllers/url";
import {
    CreateUrlSchema,
    FindAllUrlsSchema,
    FindOriginalUrlSchema,
    FindShortUrlSchema,
} from "@infra/fastify/schemas/url";
import { authMiddleware } from "./user";

const urlSequelizeRepository = new UrlSequelizeRepository();
const urlRedisRepository = new UrlRedisRepository();
const urlLogSequelizeRepository = new UrlLogSequelizeRepository();
const userSequelizeRepository = new UserSequelizeRepository();

const urlValidatorSimple = new UrlValidatorSimple();
const urlLogValidatorSimple = new UrlLogValidatorSimple();
const cuid2IdProvider = new Cuid2IdProvider();
const toBase62Provider = new ToBase62();
const uuidv4IdProvider = new UuidV4IdProvider();

const createShortUrlUseCase = new CreateShortUrlUseCase({
    idProvider: cuid2IdProvider,
    idProviderUrlShortener: uuidv4IdProvider,
    toBaseProvider: toBase62Provider,
    urlValidator: urlValidatorSimple,
    urlRepository: urlSequelizeRepository,
    userRepository: userSequelizeRepository,
});

const findOriginalUrlUseCase = new FindOriginalUrlUseCase({
    urlRepository: urlSequelizeRepository,
    urlMemoryRepository: urlRedisRepository,
    urlLogRepository: urlLogSequelizeRepository,
    idProvider: cuid2IdProvider,
    urlLogValidator: urlLogValidatorSimple,
});

const findShortUrlUseCase = new FindShortUrlUseCase({ urlRepository: urlSequelizeRepository });

const findAllUrlsByUserUseCase = new FindAllUrlsByUserUseCase({
    urlRepository: urlSequelizeRepository,
    userRepository: userSequelizeRepository,
});

const createShortControllerFastify = new CreateShortUrlControllerFastify({ createShortUrlUseCase });
const findOriginalUrlControllerFastify = new FindOriginalUrlControllerFastify({ findOriginalUrlUseCase });
const findShortUrlControllerFastify = new FindShortUrlControllerFastify({ findShortUrlUseCase });
const findAllUrlsByUserControllerFastify = new FindAllUrlsByUserControllerFastify({
    findAllUrlsByUserUseCase,
});

export default async function userRoutesFastify(fastify: FastifyInstance) {
    fastify
        .withTypeProvider<ZodTypeProvider>()
        .post(
            "/urls",
            { schema: CreateUrlSchema, preHandler: authMiddleware.execute.bind(authMiddleware) },
            fastifyAdapterRoute(createShortControllerFastify)
        )
        .get(
            "/urls/user/:user_id",
            { schema: FindAllUrlsSchema },
            fastifyAdapterRoute(findAllUrlsByUserControllerFastify)
        )
        .get("/urls/:id", { schema: FindShortUrlSchema }, fastifyAdapterRoute(findShortUrlControllerFastify))
        .get("/:short_url", { schema: FindOriginalUrlSchema }, fastifyAdapterRoute(findOriginalUrlControllerFastify));
}
