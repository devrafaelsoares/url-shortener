"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitOptions = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const _env_1 = __importDefault(require("../../../env"));
exports.rateLimitOptions = {
    timeWindow: 1 * 60 * 1000,
    max: 100,
    nameSpace: "rate_limit:ip:",
    redis: new ioredis_1.default({ host: _env_1.default.REDIS_HOST, port: _env_1.default.REDIS_PORT, password: _env_1.default.REDIS_PASSWORD }),
};
