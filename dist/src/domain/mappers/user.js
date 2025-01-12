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
exports.UserMapper = void 0;
const entities_1 = require("../entities");
class UserMapper {
    static toDomain(userSequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, email, password, hashSalt, isActive, hashingAlgorithm, verificationTokens, createdAt, updatedAt, } = userSequelize;
            const hashingAlgorithmProps = {
                name: hashingAlgorithm.name,
                createdAt: hashingAlgorithm.createdAt,
                updatedAt: hashingAlgorithm.updatedAt,
            };
            const hashingAlgorithmResult = yield entities_1.HashingAlgorithm.create({
                props: hashingAlgorithmProps,
                id: hashingAlgorithm.id,
            });
            const userResult = yield entities_1.User.create({
                props: {
                    name,
                    email,
                    hashingAlgorithm: hashingAlgorithmResult,
                    password,
                    isActive,
                    hashSalt,
                    verificationTokens: yield Promise.all(verificationTokens.map((verificationToken) => __awaiter(this, void 0, void 0, function* () {
                        return yield entities_1.VerificationToken.create({
                            props: {
                                expiresAt: verificationToken.expiresAt,
                                token: verificationToken.token,
                                type: verificationToken.type,
                                createdAt: verificationToken.createdAt,
                                updatedAt: verificationToken.updatedAt,
                            },
                            id: verificationToken.id,
                        });
                    }))),
                    createdAt,
                    updatedAt,
                },
                id,
            });
            const user = userResult.value;
            return user;
        });
    }
    static toHttpResponseUser(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: user.createdAt,
        };
    }
    static toHttpResponseUserCreate(user) {
        const token = user.verificationTokens
            .filter(token => token.type === entities_1.VerificationTokenTypes.CONFIRMATION_EMAIL)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].token;
        return {
            id: user.id,
            token,
        };
    }
}
exports.UserMapper = UserMapper;
