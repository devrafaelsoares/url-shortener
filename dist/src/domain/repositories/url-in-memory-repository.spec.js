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
const id_1 = require("../../infra/providers/id");
const to_base_1 = require("../../infra/providers/to-base");
const validators_1 = require("../validators");
const factories_1 = require("../factories");
const url_in_memory_repository_1 = require("./url-in-memory-repository");
describe("UrlInMemoryRepository", () => {
    let idProvider;
    let toBaseProvider;
    let idProviderUrlShortener;
    let currentDate;
    let urlValidatorSimple;
    let urlFactory;
    let urlRepository;
    beforeEach(() => {
        idProvider = new id_1.Cuid2IdProvider();
        idProviderUrlShortener = new id_1.UuidV4IdProvider();
        toBaseProvider = new to_base_1.ToBase62();
        currentDate = new Date();
        urlValidatorSimple = new validators_1.UrlValidatorSimple();
        urlFactory = new factories_1.UrlFactory();
        urlRepository = new url_in_memory_repository_1.UrlInMemoryRepository();
    });
    it("should be able to create a url", () => __awaiter(void 0, void 0, void 0, function* () {
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + expiresAt.getTimezoneOffset() * -60 * 1000);
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);
        yield urlRepository.reset();
        const url = urlFactory.createEntity({
            originalUrl: "https://teste.com",
            expiresAt,
        });
        yield urlRepository.create(url);
        const foundUrls = yield urlRepository.findAll();
        expect(foundUrls).toHaveLength(1);
    }));
    it("should be able to find url by short url", () => __awaiter(void 0, void 0, void 0, function* () {
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + expiresAt.getTimezoneOffset() * -60 * 1000);
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);
        yield urlRepository.reset();
        const url = urlFactory.createEntity({
            originalUrl: "https://teste.com",
            expiresAt,
        });
        yield urlRepository.create(url);
        const shortUrl = url.shortUrl;
        const foundUrl = yield urlRepository.findByShortUrl(shortUrl);
        expect(foundUrl).not.toBeNull();
    }));
    it("should be able to find url by original url", () => __awaiter(void 0, void 0, void 0, function* () {
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + expiresAt.getTimezoneOffset() * -60 * 1000);
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);
        yield urlRepository.reset();
        const url = urlFactory.createEntity({
            originalUrl: "https://teste.com",
            expiresAt,
        });
        yield urlRepository.create(url);
        const originalUrl = url.originalUrl;
        const foundUrl = yield urlRepository.findByOriginalUrl(originalUrl);
        expect(foundUrl).not.toBeNull();
    }));
});
