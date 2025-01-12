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
exports.UserSequelizeRepository = void 0;
const models_1 = require("../../infra/database/sequelize/models");
const mappers_1 = require("../mappers");
class UserSequelizeRepository {
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [affectedCount, _] = yield models_1.User.update({
                id: data.id,
                name: data.name,
                email: data.email,
                password: data.password,
                hashSalt: data.hashSalt,
                isActive: data.isActive,
                hashingAlgorithm: {
                    id: data.hashingAlgorithm.id,
                    name: data.hashingAlgorithm.name,
                },
                verificationTokens: data.verificationTokens.map(verificationToken => ({
                    id: verificationToken.id,
                    token: verificationToken.token,
                    type: verificationToken.type,
                    expiresAt: verificationToken.expiresAt,
                })),
            }, {
                where: { id: data.id },
                returning: true,
            });
            if (affectedCount < 1) {
                return;
            }
            return affectedCount;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = yield models_1.User.create({
                id: data.id,
                name: data.name,
                email: data.email,
                password: data.password,
                hashSalt: data.hashSalt,
                isActive: data.isActive,
                hashingAlgorithm: {
                    id: data.hashingAlgorithm.id,
                    name: data.hashingAlgorithm.name,
                },
                verificationTokens: data.verificationTokens.map(verificationToken => ({
                    id: verificationToken.id,
                    token: verificationToken.token,
                    type: verificationToken.type,
                    expiresAt: verificationToken.expiresAt,
                })),
            }, {
                include: [models_1.HashingAlgorithm, models_1.VerificationToken],
            });
            return mappers_1.UserMapper.toDomain(createdUser);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield models_1.User.findOne({
                where: {
                    email,
                },
                include: [models_1.HashingAlgorithm, models_1.VerificationToken],
            });
            if (!foundUser) {
                return null;
            }
            return mappers_1.UserMapper.toDomain(foundUser);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield models_1.User.findOne({
                where: { id },
                include: [models_1.HashingAlgorithm, models_1.VerificationToken],
            });
            if (!foundUser) {
                return null;
            }
            return mappers_1.UserMapper.toDomain(foundUser);
        });
    }
    find(field, value) {
        throw new Error("Method not implemented.");
    }
    findAll() {
        throw new Error("Method not implemented.");
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
}
exports.UserSequelizeRepository = UserSequelizeRepository;
