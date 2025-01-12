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
exports.ValidateUserUseCase = void 0;
const helpers_1 = require("../../../helpers");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _env_1 = __importDefault(require("../../../../env"));
class ValidateUserUseCase {
    constructor() { }
    execute(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError("Acesso não autorizado", protocols_1.HttpStatus.UNAUTHORIZED));
            }
            try {
                const isValid = jsonwebtoken_1.default.verify(token, _env_1.default.SECRET_KEY_AUTH);
                if (!isValid) {
                    return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError("Acesso não autorizado", protocols_1.HttpStatus.UNAUTHORIZED));
                }
                return (0, helpers_1.success)({
                    token: {
                        valid: true,
                    },
                });
            }
            catch (err) {
                return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError("Acesso não autorizado", protocols_1.HttpStatus.UNAUTHORIZED));
            }
        });
    }
}
exports.ValidateUserUseCase = ValidateUserUseCase;
