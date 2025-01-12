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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../entities");
const user_validator_simple_1 = require("./user-validator-simple");
const password_1 = require("../../infra/providers/password");
const id_1 = require("../../infra/providers/id");
const entities_2 = require("../entities");
const token_1 = require("../../infra/providers/token");
const _env_1 = __importDefault(require("../../../env"));
describe("UserValidatorSimple", () => {
    let userValidatorSimple;
    let passwordProvider;
    let idProvider;
    let confirmationEmailTokenProvider;
    beforeEach(() => {
        userValidatorSimple = new user_validator_simple_1.UserValidatorSimple();
        passwordProvider = new password_1.BcryptPasswordProvider();
        idProvider = new id_1.Cuid2IdProvider();
        confirmationEmailTokenProvider = new token_1.JwtToken({
            expirationTime: "1h",
            secret: _env_1.default.SECRET_KEY_TOKEN,
        });
    });
    it("should return an error if name is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const hashingAlgorithmProps = {
            name: passwordProvider.method,
        };
        const hashingAlgorithm = yield entities_2.HashingAlgorithm.create({
            idProvider,
            props: hashingAlgorithmProps,
        });
        const userProps = {
            name: "",
            email: "teste01@email.com",
            verificationTokens: [],
            urls: [],
            hashingAlgorithm,
            password: "12345678",
        };
        const userResult = yield entities_1.User.create({
            props: userProps,
            idProvider,
            passwordProviderConfig: { provider: passwordProvider },
            validator: userValidatorSimple,
        });
        expect(userResult.value).toEqual([
            {
                path: "name",
                message: "O nome é obrigatório",
            },
        ]);
    }));
    it("should return an error if email is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const hashingAlgorithmProps = {
            name: passwordProvider.method,
        };
        const hashingAlgorithm = yield entities_2.HashingAlgorithm.create({
            idProvider,
            props: hashingAlgorithmProps,
        });
        const userProps = {
            name: "Teste 02",
            email: "teste02email.com",
            verificationTokens: [],
            urls: [],
            hashingAlgorithm,
            password: "12345678",
        };
        const userResult = yield entities_1.User.create({
            props: userProps,
            idProvider,
            passwordProviderConfig: { provider: passwordProvider },
            validator: userValidatorSimple,
        });
        expect(userResult.value).toEqual([
            {
                path: "email",
                message: "Email informado é inválido",
            },
        ]);
    }));
    it("should return an error if the password is less than eight characters long", () => __awaiter(void 0, void 0, void 0, function* () {
        const hashingAlgorithmProps = {
            name: passwordProvider.method,
        };
        const hashingAlgorithm = yield entities_2.HashingAlgorithm.create({
            idProvider,
            props: hashingAlgorithmProps,
        });
        const userProps = {
            name: "Teste 03",
            email: "teste03@email.com",
            verificationTokens: [],
            urls: [],
            hashingAlgorithm,
            password: "1234567",
        };
        const userResult = yield entities_1.User.create({
            props: userProps,
            idProvider,
            passwordProviderConfig: { provider: passwordProvider },
            validator: userValidatorSimple,
        });
        expect(userResult.value).toEqual([
            {
                path: "password",
                message: "A senha deve ter no mínimo oito caracteres",
            },
        ]);
    }));
});
