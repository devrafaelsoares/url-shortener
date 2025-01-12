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
exports.RecoverChangePasswordUseCase = void 0;
const helpers_1 = require("../../../helpers");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
class RecoverChangePasswordUseCase {
    constructor(props) {
        this.props = props;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, new_password, token, }) {
            const foundUser = yield this.props.userRepository.findById(user_id);
            if (!foundUser) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.NOT_EXISTS_USER, protocols_1.HttpStatus.NOT_FOUND));
            }
            const foundToken = yield this.props.verificationTokenRepository.findByToken(token);
            if (!foundToken) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.NOT_EXISTS_TOKEN, protocols_1.HttpStatus.NOT_FOUND));
            }
            yield foundUser.setPassword(new_password, {
                provider: this.props.passwordProvider,
                salt: foundUser.hashSalt,
            });
            yield this.props.userRepository.save(foundUser);
            yield this.props.verificationTokenRepository.deleteByToken(token);
            return (0, helpers_1.success)(undefined);
        });
    }
}
exports.RecoverChangePasswordUseCase = RecoverChangePasswordUseCase;
