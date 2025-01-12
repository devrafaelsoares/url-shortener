"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const _env_1 = __importDefault(require("../../../../env"));
class RedisClient {
    constructor() {
        this.client = null;
    }
    connect() {
        if (!this.client) {
            this.client = new ioredis_1.default({
                host: _env_1.default.REDIS_HOST,
                port: _env_1.default.REDIS_PORT,
                password: _env_1.default.REDIS_PASSWORD,
            });
            console.log("Console> 🔰 Redis connected");
        }
    }
    disconnect() {
        if (this.client) {
            this.client.quit();
            this.client = null;
            console.log("Console> ❌ Redis disconnected");
        }
    }
    getClient() {
        if (!this.client) {
            throw new Error("Redis is not initialized. Call `connect()` first.");
        }
        return this.client;
    }
}
exports.default = new RedisClient();
