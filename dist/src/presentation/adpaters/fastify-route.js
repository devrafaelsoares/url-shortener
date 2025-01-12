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
exports.fastifyAdapterRoute = fastifyAdapterRoute;
const protocols_1 = require("../protocols");
function fastifyAdapterRoute(controller) {
    return function (req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield controller.handle(req, reply);
            if ((response === null || response === void 0 ? void 0 : response.status_code) === protocols_1.HttpStatus.CREATED && response.headers) {
                const location = response.headers["location"];
                reply.header("location", location);
            }
            if (Array.isArray(response === null || response === void 0 ? void 0 : response.cookies) && response.cookies.length > 0) {
                response.cookies.forEach(({ name, value, options }) => {
                    if (name && value) {
                        reply.setCookie(name, value, options || {});
                    }
                });
            }
            response === null || response === void 0 ? true : delete response.headers;
            reply.status(response.status_code).send(response);
        });
    };
}
