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
const password_1 = require("../../infra/providers/password");
const user_in_memory_repository_1 = require("./user-in-memory-repository");
const factories_1 = require("../factories");
const entities_1 = require("../entities");
const id_1 = require("../../infra/providers/id");
describe("UserInMemoryRepository", () => {
    let userInMemoryRepository;
    let passwordProvider;
    let userFactory;
    let idProvider;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        userInMemoryRepository = new user_in_memory_repository_1.UserInMemoryRepository();
        passwordProvider = new password_1.BcryptPasswordProvider();
        idProvider = new id_1.Cuid2IdProvider();
        const passwordProviderConfig = {
            provider: passwordProvider,
            salt: yield passwordProvider.salt(),
        };
        userFactory = new factories_1.UserFactory(idProvider, passwordProviderConfig);
    }));
    it("should be able to create a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const userResult = yield userFactory.createEntity();
        if (userResult.isSuccess()) {
            const user = userResult.value;
            const savedUser = yield userInMemoryRepository.create(user);
            expect(savedUser).toStrictEqual(expect.any(entities_1.User));
        }
    }));
});
