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
exports.LoginUserControllerFastify = void 0;
const protocols_1 = require("../../../../presentation/protocols");
class LoginUserControllerFastify {
    constructor(props) {
        this.props = props;
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const loginUserResult = yield this.props.loginUserUseCase.execute(body);
            const moment = new Date();
            if (loginUserResult.isError()) {
                const value = loginUserResult.value;
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
            const { value: { token, refresh_token, user_id }, } = loginUserResult;
            return {
                success: true,
                moment,
                data: {
                    token: token.value,
                    refresh_token: refresh_token.value,
                    user_id,
                },
                status_code: protocols_1.HttpStatus.OK,
                cookies: [
                    {
                        name: "API_AUTH",
                        value: token.value,
                        options: {
                            httpOnly: true,
                            expires: token.expires,
                        },
                    },
                    {
                        name: "REFRESH_TOKEN",
                        value: refresh_token.value,
                        options: {
                            httpOnly: true,
                            expires: refresh_token.expires,
                        },
                    },
                    {
                        name: "USER_ID",
                        value: user_id,
                        options: {
                            httpOnly: true,
                        },
                    },
                ],
            };
        });
    }
}
exports.LoginUserControllerFastify = LoginUserControllerFastify;
