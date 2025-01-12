"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutesFastify;
const adpaters_1 = require("../../../presentation/adpaters");
const validators_1 = require("../../../domain/validators");
const id_1 = require("../../providers/id");
const repositories_1 = require("../../../domain/repositories");
const url_1 = require("../../../domain/usecases/url");
const to_base_1 = require("../../providers/to-base");
const url_2 = require("../../fastify/controllers/url");
const url_3 = require("../../fastify/schemas/url");
const user_1 = require("./user");
const urlSequelizeRepository = new repositories_1.UrlSequelizeRepository();
const urlRedisRepository = new repositories_1.UrlRedisRepository();
const urlLogSequelizeRepository = new repositories_1.UrlLogSequelizeRepository();
const userSequelizeRepository = new repositories_1.UserSequelizeRepository();
const urlValidatorSimple = new validators_1.UrlValidatorSimple();
const urlLogValidatorSimple = new validators_1.UrlLogValidatorSimple();
const cuid2IdProvider = new id_1.Cuid2IdProvider();
const toBase62Provider = new to_base_1.ToBase62();
const uuidv4IdProvider = new id_1.UuidV4IdProvider();
const createShortUrlUseCase = new url_1.CreateShortUrlUseCase({
    idProvider: cuid2IdProvider,
    idProviderUrlShortener: uuidv4IdProvider,
    toBaseProvider: toBase62Provider,
    urlValidator: urlValidatorSimple,
    urlRepository: urlSequelizeRepository,
    userRepository: userSequelizeRepository,
});
const findOriginalUrlUseCase = new url_1.FindOriginalUrlUseCase({
    urlRepository: urlSequelizeRepository,
    urlMemoryRepository: urlRedisRepository,
    urlLogRepository: urlLogSequelizeRepository,
    idProvider: cuid2IdProvider,
    urlLogValidator: urlLogValidatorSimple,
});
const findShortUrlUseCase = new url_1.FindShortUrlUseCase({ urlRepository: urlSequelizeRepository });
const findAllUrlsByUserUseCase = new url_1.FindAllUrlsByUserUseCase({
    urlRepository: urlSequelizeRepository,
    userRepository: userSequelizeRepository,
});
const createShortControllerFastify = new url_2.CreateShortUrlControllerFastify({ createShortUrlUseCase });
const findOriginalUrlControllerFastify = new url_2.FindOriginalUrlControllerFastify({ findOriginalUrlUseCase });
const findShortUrlControllerFastify = new url_2.FindShortUrlControllerFastify({ findShortUrlUseCase });
const findAllUrlsByUserControllerFastify = new url_2.FindAllUrlsByUserControllerFastify({
    findAllUrlsByUserUseCase,
});
function userRoutesFastify(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify
            .withTypeProvider()
            .post("/urls", { schema: url_3.CreateUrlSchema, preHandler: user_1.authMiddleware.execute.bind(user_1.authMiddleware) }, (0, adpaters_1.fastifyAdapterRoute)(createShortControllerFastify))
            .get("/urls/user/:user_id", { schema: url_3.FindAllUrlsSchema }, (0, adpaters_1.fastifyAdapterRoute)(findAllUrlsByUserControllerFastify))
            .get("/urls/:id", { schema: url_3.FindShortUrlSchema }, (0, adpaters_1.fastifyAdapterRoute)(findShortUrlControllerFastify))
            .get("/:short_url", { schema: url_3.FindOriginalUrlSchema }, (0, adpaters_1.fastifyAdapterRoute)(findOriginalUrlControllerFastify));
    });
}
