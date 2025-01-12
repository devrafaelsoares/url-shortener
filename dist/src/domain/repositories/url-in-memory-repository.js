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
exports.UrlInMemoryRepository = void 0;
class UrlInMemoryRepository {
    constructor() {
        this.urls = [];
    }
    findPaginatedByUser(page, limit, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.urls.filter(url => url.userId === userId).slice((page - 1) * limit, page * limit);
        });
    }
    countByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.urls.filter(url => url.userId === userId).length;
        });
    }
    findByShortUrl(shortUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUrl = this.urls.find(url => url.shortUrl === shortUrl);
            return !foundUrl ? null : foundUrl;
        });
    }
    findByOriginalUrl(originalUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUrl = this.urls.find(url => url.originalUrl === originalUrl);
            return !foundUrl ? null : foundUrl;
        });
    }
    create(url) {
        return __awaiter(this, void 0, void 0, function* () {
            this.urls.push(url);
            return url;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUrl = this.urls.find(url => url.id === id);
            return !foundUrl ? null : foundUrl;
        });
    }
    findByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUrls = this.urls.filter(url => url.userId === userId);
            return foundUrls;
        });
    }
    incrementAccessCount(urlId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundIndexUrl = this.urls.findIndex(url => url.id === urlId);
            this.urls[foundIndexUrl].hitCount++;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.urls;
        });
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.urls.length > 0) {
                this.urls.pop();
            }
        });
    }
}
exports.UrlInMemoryRepository = UrlInMemoryRepository;
