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
exports.RegisterUserUseCase = void 0;
const entities_1 = require("../../entities");
const helpers_1 = require("../../../helpers");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
const user_1 = require("../../mappers/user");
class RegisterUserUseCase {
    constructor(props) {
        this.props = props;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, name, password, }) {
            const foundUser = yield this.props.userRepository.findByEmail(email);
            if (foundUser) {
                return (0, helpers_1.error)(new errors_1.ExistsEntityError(errors_1.ErrorMessages.EXISTS_USER_EMAIL, protocols_1.HttpStatus.CONFLIT));
            }
            const hashingAlgorithm = yield entities_1.HashingAlgorithm.create({
                idProvider: this.props.idProvider,
                props: {
                    name: this.props.passwordProvider.method,
                },
            });
            const userResult = yield entities_1.User.create({
                props: {
                    name: name,
                    email: email,
                    hashingAlgorithm,
                    password: password,
                },
                idProvider: this.props.idProvider,
                passwordProviderConfig: {
                    provider: this.props.passwordProvider,
                    salt: yield this.props.passwordProvider.salt(),
                },
                validator: this.props.userValidator,
            });
            if (userResult.isError()) {
                return (0, helpers_1.error)(userResult.value);
            }
            const user = userResult.value;
            const { token, expiresAt } = this.props.tokenProvider.generate();
            const userEmailConfirmation = yield entities_1.VerificationToken.create({
                props: {
                    token,
                    expiresAt,
                    type: entities_1.VerificationTokenTypes.CONFIRMATION_EMAIL,
                },
                idProvider: this.props.idProvider,
                tokenProvider: this.props.tokenProvider,
            });
            user.addVerificationToken(userEmailConfirmation);
            const createdUser = yield this.props.userRepository.create(user);
            if (this.props.sendEmail === entities_1.SendEmail.TRUE) {
                const sendEmailInfo = yield this.props.sendEmailUserEmailConfirmation.send(createdUser);
                if (sendEmailInfo.isError()) {
                    const { message } = sendEmailInfo.value;
                    return (0, helpers_1.error)(new errors_1.NotFoundEntityError(message, protocols_1.HttpStatus.INTERNAL_SERVER_ERROR));
                }
                if (sendEmailInfo.isError()) {
                    const { message } = sendEmailInfo.value;
                    return (0, helpers_1.error)(new errors_1.NotFoundEntityError(message, protocols_1.HttpStatus.INTERNAL_SERVER_ERROR));
                }
            }
            return (0, helpers_1.success)(user_1.UserMapper.toHttpResponseUserCreate(createdUser));
        });
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
