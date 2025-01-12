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
exports.UrlSequelizeRepository = void 0;
const models_1 = require("../../infra/database/sequelize/models");
const mappers_1 = require("../mappers");
class UrlSequelizeRepository {
    findByShortUrl(shortUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUrl = yield models_1.Url.findOne({
                where: {
                    shortUrl,
                },
            });
            return !foundUrl ? null : mappers_1.UrlMapper.toDomain(foundUrl);
        });
    }
    findPaginatedByUser() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, userId) {
            const foundUrls = yield models_1.Url.findAll({
                offset: page - 1,
                limit,
                where: {
                    userId,
                },
            });
            return foundUrls.map(mappers_1.UrlMapper.toDomain);
        });
    }
    countByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Url.count({ where: { userId } });
        });
    }
    findByOriginalUrl(originalUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUrl = yield models_1.Url.findOne({
                where: {
                    originalUrl,
                },
            });
            return !foundUrl ? null : mappers_1.UrlMapper.toDomain(foundUrl);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUrls = yield models_1.Url.findAll();
            return foundUrls.map(mappers_1.UrlMapper.toDomain);
        });
    }
    incrementAccessCount(urlId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Url.increment("hit_count", {
                by: 1,
                where: {
                    id: urlId,
                },
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUrl = yield models_1.Url.findOne({
                where: {
                    id,
                },
            });
            return !foundUrl ? null : mappers_1.UrlMapper.toDomain(foundUrl);
        });
    }
    findByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUrls = yield models_1.Url.findAll({
                where: {
                    userId,
                },
            });
            return foundUrls.map(mappers_1.UrlMapper.toDomain);
        });
    }
    create(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUrl = yield models_1.Url.create({
                id: url.id,
                originalUrl: url.originalUrl,
                shortUrl: url.shortUrl,
                hitCount: url.hitCount,
                expiresAt: url.expiresAt,
                userId: url.userId,
            });
            return mappers_1.UrlMapper.toDomain(createdUrl);
        });
    }
    reset() {
        throw new Error("Method not implemented.");
    }
}
exports.UrlSequelizeRepository = UrlSequelizeRepository;
