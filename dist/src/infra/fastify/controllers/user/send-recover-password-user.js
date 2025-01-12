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
exports.SendRecoverPasswordControllerFastify = void 0;
const protocols_1 = require("../../../../presentation/protocols");
class SendRecoverPasswordControllerFastify {
    constructor(props) {
        this.props = props;
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const sendRecoverPasswordResult = yield this.props.sendRecoverPasswordUseCase.execute(body);
            const moment = new Date();
            if (sendRecoverPasswordResult.isError()) {
                const value = sendRecoverPasswordResult.value;
                if (value instanceof Error) {
                    const { message, statusCode } = value;
                    return {
                        success: false,
                        moment,
                        status_code: statusCode,
                        data: { message },
                    };
                }
                return {
                    success: false,
                    moment,
                    data: value,
                    status_code: protocols_1.HttpStatus.BAD_REQUEST,
                };
            }
            return {
                success: true,
                moment,
                data: { message: "Solicitação de alteração de senha enviada para o email informado" },
                status_code: protocols_1.HttpStatus.OK,
            };
        });
    }
}
exports.SendRecoverPasswordControllerFastify = SendRecoverPasswordControllerFastify;
