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
exports.VerificationTokenMapper = void 0;
const entities_1 = require("../entities");
class VerificationTokenMapper {
    static toDomain(verificationTokenSequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, token, type, expiresAt, createdAt, updatedAt, user } = verificationTokenSequelize;
            const verifcationTokenResult = entities_1.VerificationToken.create({
                props: {
                    token,
                    type: type,
                    expiresAt,
                    createdAt,
                    updatedAt,
                },
                id,
            });
            const verifcationToken = yield verifcationTokenResult;
            return verifcationToken;
        });
    }
}
exports.VerificationTokenMapper = VerificationTokenMapper;
