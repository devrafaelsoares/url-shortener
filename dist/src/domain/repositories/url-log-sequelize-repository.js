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
exports.UrlLogSequelizeRepository = void 0;
const models_1 = require("../../infra/database/sequelize/models");
const mappers_1 = require("../mappers");
class UrlLogSequelizeRepository {
    create(urlLog) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUrlLog = yield models_1.UrlLog.create({
                id: urlLog.id,
                ipAddress: urlLog.ipAddress,
                userAgent: urlLog.userAgent,
                accessedAt: urlLog.accessedAt,
                urlId: urlLog.urlId,
            });
            return mappers_1.UrlLogMapper.toDomain(createdUrlLog);
        });
    }
}
exports.UrlLogSequelizeRepository = UrlLogSequelizeRepository;