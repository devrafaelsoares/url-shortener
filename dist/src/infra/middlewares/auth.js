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
exports.AuthMiddleware = void 0;
const protocols_1 = require("../../presentation/protocols");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _env_1 = __importDefault(require("../../../env"));
class AuthMiddleware {
    constructor(props) {
        this.props = props;
    }
    execute(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const moment = new Date();
            const apiKey = request.cookies["API_AUTH"];
            if (!apiKey) {
                return reply.status(protocols_1.HttpStatus.UNAUTHORIZED).send({
                    moment,
                    success: false,
                    data: {
                        message: "Acesso não autorizado",
                    },
                    status_code: protocols_1.HttpStatus.UNAUTHORIZED,
                });
            }
            try {
                const decodedToken = jsonwebtoken_1.default.verify(apiKey, _env_1.default.SECRET_KEY_AUTH);
                const foundUser = yield this.props.userRepository.findById(decodedToken.id);
                if (!foundUser) {
                    return reply.status(protocols_1.HttpStatus.UNAUTHORIZED).send({
                        moment,
                        success: false,
                        data: {
                            message: "Acesso não autorizado",
                        },
                        status_code: protocols_1.HttpStatus.UNAUTHORIZED,
                    });
                }
            }
            catch (err) {
                return reply.status(protocols_1.HttpStatus.UNAUTHORIZED).send({
                    moment,
                    success: false,
                    data: {
                        message: "Acesso não autorizado",
                    },
                    status_code: protocols_1.HttpStatus.UNAUTHORIZED,
                });
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
