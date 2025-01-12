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
exports.VerificationTokenRedisRepository = void 0;
const redis_1 = __importDefault(require("../../infra/database/redis"));
class VerificationTokenRedisRepository {
    canSendToken(verificationTokenBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            const isBlocked = yield redis_1.default.getClient().get(verificationTokenBlocked);
            return isBlocked ? true : false;
        });
    }
    addTemporaryHold(blockKey, value, blockDuration) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_1.default.getClient().set(blockKey, value, "EX", blockDuration);
        });
    }
    getWaitingTime(verificationTokenBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield redis_1.default.getClient().ttl(verificationTokenBlocked);
        });
    }
}
exports.VerificationTokenRedisRepository = VerificationTokenRedisRepository;
