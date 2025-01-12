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
const url_1 = require("./url");
const url_shortener_1 = require("../../infra/providers/url-shortener");
const validators_1 = require("../validators");
const factories_1 = require("../factories");
const password_1 = require("../../infra/providers/password");
describe("Url", () => {
    let idProvider;
    let toBaseProvider;
    let idProviderUrlShortener;
    let passwordProvider;
    let currentDate;
    let urlValidatorSimple;
    let userFactory;
    beforeEach(() => {
        idProvider = new id_1.Cuid2IdProvider();
        idProviderUrlShortener = new id_1.UuidV4IdProvider();
        toBaseProvider = new to_base_1.ToBase62();
        currentDate = new Date();
        urlValidatorSimple = new validators_1.UrlValidatorSimple();
        passwordProvider = new password_1.BcryptPasswordProvider();
        userFactory = new factories_1.UserFactory(idProvider, { provider: passwordProvider });
    });
    it("should be able to create a Url", () => __awaiter(void 0, void 0, void 0, function* () {
        const userResult = yield userFactory.createEntity();
        const user = userResult.value;
        const urlPropsCreate = {
            originalUrl: "https://google.com/",
            expiresAt: new Date(currentDate.setMinutes(5)),
            userId: user.id,
            user,
        };
        const urlResult = url_1.Url.create({
            props: urlPropsCreate,
            providers: {
                idProvider,
                urlShortenerProvider: new url_shortener_1.UrlShortenerToBase(toBaseProvider, idProviderUrlShortener),
            },
            validator: urlValidatorSimple,
        });
        const url = urlResult.value;
        expect(url).toStrictEqual(expect.any(url_1.Url));
    }));
    it("should not be able to crate a Url", () => __awaiter(void 0, void 0, void 0, function* () {
        const userResult = yield userFactory.createEntity();
        const user = userResult.value;
        const urlPropsCreate = {
            originalUrl: "",
            expiresAt: new Date(currentDate.setMinutes(5)),
            userId: user.id,
            user,
        };
        const urlResult = url_1.Url.create({
            props: urlPropsCreate,
            providers: {
                idProvider,
                urlShortenerProvider: new url_shortener_1.UrlShortenerToBase(toBaseProvider, idProviderUrlShortener),
            },
            validator: urlValidatorSimple,
        });
        expect(urlResult.isError()).toBeTruthy();
        expect(urlResult.value).toEqual([
            {
                path: "originalUrl",
                message: "A url original é obrigatório",
            },
        ]);
    }));
});
