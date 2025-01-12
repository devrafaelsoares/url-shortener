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
exports.ConfirmAccountUserUseCase = void 0;
const helpers_1 = require("../../../helpers");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
class ConfirmAccountUserUseCase {
    constructor(props) {
        this.props = props;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, token, }) {
            const foundVerificationToken = yield this.props.verificationTokenRepository.findByToken(token);
            if (!foundVerificationToken) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.NOT_EXISTS_TOKEN, protocols_1.HttpStatus.NOT_FOUND));
            }
            const foundUser = yield this.props.userRepository.findById(id);
            if (!foundUser) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.NOT_EXISTS_USER, protocols_1.HttpStatus.NOT_FOUND));
            }
            const verificationToken = foundUser.verificationTokens.find(verificationTokenUser => verificationTokenUser.id === foundVerificationToken.id);
            if (!verificationToken) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.TOKEN_NOT_MATCH_USER, protocols_1.HttpStatus.UNAUTHORIZED));
            }
            if (foundUser.isActive) {
                return (0, helpers_1.error)(new errors_1.BadRequestEntityError(errors_1.ErrorMessages.ACCOUNT_ALREADY_ACTIVATED, protocols_1.HttpStatus.BAD_REQUEST));
            }
            const tokenIsValid = this.getCurrentDate().getTime() < verificationToken.expiresAt.getTime();
            if (!tokenIsValid) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.EXPIRED_TOKEN, protocols_1.HttpStatus.GONE));
            }
            foundUser.activate();
            const updatedUser = yield this.props.userRepository.save(foundUser);
            if (!updatedUser) {
                return (0, helpers_1.error)(new errors_1.InternalServerError(errors_1.ErrorMessages.ERROR_CREATING_ACCOUNT, protocols_1.HttpStatus.INTERNAL_SERVER_ERROR));
            }
            return (0, helpers_1.success)(undefined);
        });
    }
    getCurrentDate() {
        const currentDate = new Date();
        return new Date(currentDate.getTime());
    }
}
exports.ConfirmAccountUserUseCase = ConfirmAccountUserUseCase;
