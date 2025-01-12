"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookiesOptions = void 0;
const _env_1 = __importDefault(require("../../../env"));
exports.cookiesOptions = {
    secret: _env_1.default.FASTIFY_SECRET_COOKIE,
    hook: "preHandler",
    parseOptions: {
        domain: "192.168.100.6",
        sameSite: "lax",
        path: "/",
        secure: false,
    },
};
