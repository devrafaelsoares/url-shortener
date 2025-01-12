"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _env_1 = __importDefault(require("../../../../env"));
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("./models");
const isProduction = _env_1.default.NODE_ENV === "production" ? true : false;
const sequelizeOptionsDevelopmentPostgres = {
    username: _env_1.default.DATABASE_USER,
    password: _env_1.default.DATABASE_PASSWORD,
    database: _env_1.default.DATABASE_NAME,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
    },
    host: _env_1.default.DATABASE_HOST,
    dialect: "postgres",
    logging: isProduction ? false : console.log,
    timezone: "America/Sao_Paulo",
    models: [models_1.Url, models_1.UrlLog, models_1.User, models_1.HashingAlgorithm, models_1.VerificationToken],
};
exports.default = new sequelize_typescript_1.Sequelize(sequelizeOptionsDevelopmentPostgres);
