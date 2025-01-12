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
require("module-alias/register");
require("../lib/module-alias");
const _env_1 = __importDefault(require("../../env"));
const os_1 = __importDefault(require("os"));
const app_1 = __importDefault(require("./fastify/app"));
const sequelize_1 = __importDefault(require("../infra/database/sequelize"));
const redis_1 = __importDefault(require("../infra/database/redis"));
function getSystemInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            nodeVersion: process.version,
            platform: process.platform,
            architecture: process.arch,
            cpus: os_1.default.cpus().length,
            memory: os_1.default.totalmem(),
            freeMemory: os_1.default.freemem(),
        };
    });
}
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const systemInfo = yield getSystemInfo();
            console.log("\nConsole> 🔰 System Information: \n");
            console.log(` * Node Version: ${systemInfo.nodeVersion}`);
            console.log(` * Platform: ${systemInfo.platform}`);
            console.log(` * Architecture: ${systemInfo.architecture}`);
            console.log(` * CPU Cores: ${systemInfo.cpus}`);
            console.log(` * Total Memory: ${(systemInfo.memory / Math.pow(1024, 3)).toFixed(2)} GB`);
            console.log(` * Free Memory: ${(systemInfo.freeMemory / Math.pow(1024, 3)).toFixed(2)} GB\n`);
            yield sequelize_1.default.sync({ alter: true });
            console.log(`\nConsole> 🔰 Database running\n`);
            redis_1.default.connect();
            app_1.default.listen({ host: _env_1.default.FASTIFY_HOST, port: Number(_env_1.default.FASTIFY_PORT) }, (err, address) => {
                if (err) {
                    console.error("\nConsole> ❌ Error starting server:", err);
                    process.exit(1);
                }
                else {
                    console.log(`\nConsole> 🔰 Server running: ${address}`);
                    app_1.default.swagger();
                    console.log(`Console> 🔰 Swagger running: ${address + "/docs"} \n`);
                }
            });
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }
    });
}
startServer();
