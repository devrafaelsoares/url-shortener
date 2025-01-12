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
exports.SendConfirmationAccountUserUseCase = void 0;
const entities_1 = require("../../entities");
const helpers_1 = require("../../../helpers");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
const _env_1 = __importDefault(require("../../../../env"));
class SendConfirmationAccountUserUseCase {
    constructor(props) {
        this.props = props;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, }) {
            const BLOCK_KEY = `verification:token:${id}`;
            const isBlocked = yield this.props.verificationTokenMemoryRepository.canSendToken(BLOCK_KEY);
            if (isBlocked) {
                const time = yield this.props.verificationTokenMemoryRepository.getWaitingTime(BLOCK_KEY);
                return (0, helpers_1.error)(new errors_1.BadRequestEntityError(`Você poderá enviar uma nova solicitação em ${helpers_1.TimeUtils.parseTime(time)}`, protocols_1.HttpStatus.BAD_REQUEST));
            }
            const foundUser = yield this.props.userRepository.findById(id);
            if (!foundUser) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.NOT_EXISTS_USER, protocols_1.HttpStatus.NOT_FOUND));
            }
            if (foundUser.isActive) {
                return (0, helpers_1.error)(new errors_1.BadRequestEntityError(errors_1.ErrorMessages.ACCOUNT_ALREADY_ACTIVATED, protocols_1.HttpStatus.BAD_REQUEST));
            }
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
            const lastRemoveVerificationToken = foundUser.removeLastVerificationToken();
            if (lastRemoveVerificationToken) {
                yield this.props.verificationTokenRepository.delete(lastRemoveVerificationToken.id);
            }
            foundUser.addVerificationToken(userEmailConfirmation);
            yield this.props.verificationTokenRepository.create(userEmailConfirmation, id);
            yield this.props.verificationTokenMemoryRepository.addTemporaryHold(BLOCK_KEY, "1", helpers_1.TimeUtils.parseDuration(_env_1.default.VERIFICATION_TOKEN_RESEND_INTERVAL));
            if (this.props.sendEmail === entities_1.SendEmail.TRUE) {
                const sendEmailInfo = yield this.props.sendEmailUserEmailConfirmation.send(foundUser);
                if (sendEmailInfo.isError()) {
                    const { message } = sendEmailInfo.value;
                    return (0, helpers_1.error)(new errors_1.NotFoundEntityError(message, protocols_1.HttpStatus.INTERNAL_SERVER_ERROR));
                }
                if (sendEmailInfo.isError()) {
                    const { message } = sendEmailInfo.value;
                    return (0, helpers_1.error)(new errors_1.NotFoundEntityError(message, protocols_1.HttpStatus.INTERNAL_SERVER_ERROR));
                }
            }
            return (0, helpers_1.success)(undefined);
        });
    }
}
exports.SendConfirmationAccountUserUseCase = SendConfirmationAccountUserUseCase;
