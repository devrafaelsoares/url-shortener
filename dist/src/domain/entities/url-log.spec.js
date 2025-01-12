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
const factories_1 = require("../factories");
const url_log_1 = require("./url-log");
const validators_1 = require("../validators");
describe("UrlLog", () => {
    let idProvider;
    let currentDate;
    let urlFactory;
    let urlLogValidator;
    beforeEach(() => {
        idProvider = new id_1.Cuid2IdProvider();
        currentDate = new Date();
        urlFactory = new factories_1.UrlFactory();
        urlLogValidator = new validators_1.UrlLogValidatorSimple();
    });
    it("should be able to create a url log", () => {
        const url = urlFactory.createEntity({
            originalUrl: "https://teste.com",
        });
        const urlLogProps = {
            ipAddress: "207.69.0.114",
            accessedAt: new Date(),
            userAgent: "Mozilla/5.0",
            urlId: url.id,
            url: url,
        };
        const urlLogResult = url_log_1.UrlLog.create({
            props: urlLogProps,
            providers: { idProvider },
            validator: urlLogValidator,
        });
        const urlLog = urlLogResult.value;
        expect(urlLog).toStrictEqual(expect.any(url_log_1.UrlLog));
    });
    it("should not be able to crate a url log", () => __awaiter(void 0, void 0, void 0, function* () {
        const url = urlFactory.createEntity({
            originalUrl: "https://teste.com",
        });
        const urlLogProps = {
            ipAddress: "ip adddress",
            accessedAt: new Date(),
            userAgent: "Mozilla/5.0",
            urlId: url.id,
            url: url,
        };
        const urlLogResult = url_log_1.UrlLog.create({
            props: urlLogProps,
            providers: { idProvider },
            validator: urlLogValidator,
        });
        expect(urlLogResult.isError()).toBeTruthy();
        expect(urlLogResult.value).toEqual([
            {
                path: "ipAddress",
                message: "Endereço ip informado é inválido",
            },
        ]);
    }));
});
