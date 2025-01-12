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
const validators_1 = require("../validators");
const user_1 = require("./user");
const password_1 = require("../../infra/providers/password");
const id_1 = require("../../infra/providers/id");
const hashing_algorithm_1 = require("./hashing-algorithm");
const token_1 = require("../../infra/providers/token");
const verification_token_1 = require("./verification-token");
const _env_1 = __importDefault(require("../../../env"));
describe("User", () => {
    let userValidator;
    let passwordProvider;
    let idProvider;
    let confirmationEmailTokenProvider;
    beforeEach(() => {
        idProvider = new id_1.Cuid2IdProvider();
        passwordProvider = new password_1.BcryptPasswordProvider();
        confirmationEmailTokenProvider = new token_1.JwtToken({ secret: _env_1.default.SECRET_KEY_TOKEN, expirationTime: "1h" });
        userValidator = new validators_1.UserValidatorSimple();
    });
    it("should be able to create a User", () => __awaiter(void 0, void 0, void 0, function* () {
        const hashingAlgorithmProps = {
            name: passwordProvider.method,
        };
        const hashingAlgorithm = yield hashing_algorithm_1.HashingAlgorithm.create({
            idProvider,
            props: hashingAlgorithmProps,
        });
        const userProps = {
            email: "tetse01@gmail.com",
            hashingAlgorithm,
            verificationTokens: [],
            urls: [],
            password: "12345678",
            name: "Teste 01",
        };
        const userResult = yield user_1.User.create({
            props: userProps,
            idProvider: idProvider,
            passwordProviderConfig: {
                provider: passwordProvider,
                salt: yield passwordProvider.salt(),
            },
            validator: userValidator,
        });
        const user = userResult.value;
        const { token, expiresAt } = confirmationEmailTokenProvider.generate();
        const verificationToken = yield verification_token_1.VerificationToken.create({
            props: {
                token,
                expiresAt,
                type: verification_token_1.VerificationTokenTypes.CONFIRMATION_EMAIL,
            },
            idProvider,
            tokenProvider: confirmationEmailTokenProvider,
        });
        user.addVerificationToken(verificationToken);
        expect(user).toStrictEqual(expect.any(user_1.User));
    }));
    it("should not be able to crate a User", () => __awaiter(void 0, void 0, void 0, function* () {
        const hashingAlgorithmProps = {
            name: passwordProvider.method,
        };
        const hashingAlgorithm = yield hashing_algorithm_1.HashingAlgorithm.create({
            idProvider,
            props: hashingAlgorithmProps,
        });
        const userProps = {
            name: "Teste 02",
            email: "teste02@.com",
            hashingAlgorithm,
            verificationTokens: [],
            urls: [],
            password: "87654321",
        };
        const userResult = yield user_1.User.create({
            props: userProps,
            idProvider: idProvider,
            passwordProviderConfig: {
                provider: passwordProvider,
                salt: yield passwordProvider.salt(),
            },
            validator: userValidator,
        });
        expect(userResult.isError()).toBeTruthy();
        expect(userResult.value).toEqual([
            {
                path: "email",
                message: "Email informado é inválido",
            },
        ]);
    }));
});
