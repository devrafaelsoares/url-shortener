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
exports.SendUserRecoverPasswordUseCase = void 0;
const helpers_1 = require("../../../helpers");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
const entities_1 = require("../../entities");
const email_1 = require("../../../presentation/templates/email");
class SendUserRecoverPasswordUseCase {
    constructor(props) {
        this.props = props;
        this.urlBuilder = (0, helpers_1.createFrontUrlBuilderDevelopment)();
    }
    send(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email, verificationTokens } = user;
            const htmlContent = email_1.userRecoverPasswordApiTemplateHtml.replace("[ID_PASSWORD_RECOVER]", id).replace("[TOKEN_PASSWORD_RECOVER]", verificationTokens
                .filter(token => token.type === entities_1.VerificationTokenTypes.PASSWORD_RECOVERY)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].token);
            const sendEmailInfo = yield this.props.emailService.send(entities_1.Email.create({
                from: "rafael.soares.developer@gmail.com",
                to: email,
                subject: "Recuperação de conta - Altere a sua senha",
                html: htmlContent,
            }));
            if (sendEmailInfo.isError()) {
                const { message } = sendEmailInfo.value;
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(message, protocols_1.HttpStatus.INTERNAL_SERVER_ERROR));
            }
            return (0, helpers_1.success)(undefined);
        });
    }
}
exports.SendUserRecoverPasswordUseCase = SendUserRecoverPasswordUseCase;
