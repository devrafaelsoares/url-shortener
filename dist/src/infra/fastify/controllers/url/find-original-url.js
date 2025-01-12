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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindOriginalUrlControllerFastify = void 0;
const protocols_1 = require("../../../../presentation/protocols");
class FindOriginalUrlControllerFastify {
    constructor(props) {
        this.props = props;
    }
    handle(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { short_url } = request.params;
            const xForwardedFor = request.headers["x-forwarded-for"];
            const ipAddress = xForwardedFor || request.ip;
            const userAgent = request.headers["user-agent"];
            const foundUrlResult = yield this.props.findOriginalUrlUseCase.execute({
                ip_address: ipAddress,
                user_agent: userAgent,
                short_url,
            });
            const moment = new Date();
            if (foundUrlResult.isError()) {
                const value = foundUrlResult.value;
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
            const url = __rest(foundUrlResult.value, []);
            reply.redirect(url.original_url, protocols_1.HttpStatus.REDIRECT);
        });
    }
}
exports.FindOriginalUrlControllerFastify = FindOriginalUrlControllerFastify;
