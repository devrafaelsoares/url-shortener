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
exports.VerificationTokenSequelizeRepository = void 0;
const models_1 = require("../../infra/database/sequelize/models");
const mappers_1 = require("../mappers");
class VerificationTokenSequelizeRepository {
    create(verificationToken, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const verificationTokenCreated = yield models_1.VerificationToken.create({
                id: verificationToken.id,
                token: verificationToken.token,
                type: verificationToken.type,
                expiresAt: verificationToken.expiresAt,
                userId: userId,
            });
            return mappers_1.VerificationTokenMapper.toDomain(verificationTokenCreated);
        });
    }
    findByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundVerificationToken = yield models_1.VerificationToken.findOne({
                where: {
                    token,
                },
                include: [models_1.User],
            });
            if (!foundVerificationToken) {
                return null;
            }
            return mappers_1.VerificationTokenMapper.toDomain(foundVerificationToken);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.VerificationToken.destroy({ where: { id } });
        });
    }
    deleteByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.VerificationToken.destroy({ where: { token } });
        });
    }
}
exports.VerificationTokenSequelizeRepository = VerificationTokenSequelizeRepository;
