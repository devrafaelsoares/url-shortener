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
exports.RevalidateUserUseCase = void 0;
const helpers_1 = require("../../../helpers");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _env_1 = __importDefault(require("../../../../env"));
class RevalidateUserUseCase {
    constructor() { }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ refresh_token, }) {
            if (!refresh_token) {
                return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError("Refresh token é obrigatório.", protocols_1.HttpStatus.UNAUTHORIZED));
            }
            try {
                const decodedToken = jsonwebtoken_1.default.verify(refresh_token, _env_1.default.SECRET_KEY_AUTH);
                const isValid = jsonwebtoken_1.default.verify(refresh_token, _env_1.default.SECRET_KEY_AUTH);
                if (!isValid) {
                    return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError("Acesso não autorizado", protocols_1.HttpStatus.UNAUTHORIZED));
                }
                const tokenData = this.generateToken(decodedToken.id, _env_1.default.SECRET_KEY_AUTH, _env_1.default.TOKEN_DURATION);
                return (0, helpers_1.success)(tokenData);
            }
            catch (err) {
                return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError("Acesso não autorizadod", protocols_1.HttpStatus.UNAUTHORIZED));
            }
        });
    }
    generateToken(userId, secret, expiresIn) {
        const now = new Date();
        const durationInSeconds = helpers_1.TimeUtils.parseDuration(expiresIn);
        if (!durationInSeconds) {
            throw new Error("Invalid expiresIn format");
        }
        const expires = new Date(now.getTime() + durationInSeconds * 1000);
        const token = jsonwebtoken_1.default.sign({ id: userId }, secret, { expiresIn });
        return { value: token, expires };
    }
}
exports.RevalidateUserUseCase = RevalidateUserUseCase;
