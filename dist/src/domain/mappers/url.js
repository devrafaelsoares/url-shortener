"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlMapper = void 0;
const entities_1 = require("../entities");
const helpers_1 = require("../../helpers");
class UrlMapper {
    static toDomain(urlSequelize) {
        const { id, originalUrl, shortUrl, hitCount, expiresAt, createdAt, updatedAt } = urlSequelize;
        const urlResult = entities_1.Url.create({
            props: {
                originalUrl,
                shortUrl,
                hitCount,
                expiresAt,
                createdAt,
                updatedAt,
            },
            providers: undefined,
            validator: undefined,
            id,
        });
        const url = urlResult.value;
        return url;
    }
    static toDomainWithValidation(request, user, urlValidation, urlId) {
        const { original_url } = request;
        const urlPropsCreate = {
            originalUrl: original_url,
        };
        const urlResult = entities_1.Url.create({
            props: urlPropsCreate,
            validator: urlValidation,
            id: urlId,
        });
        if (urlResult.isError()) {
            return (0, helpers_1.error)(urlResult.value);
        }
        const url = urlResult.value;
        return (0, helpers_1.success)(url);
    }
    static toHttpResponse(url) {
        return {
            id: url.id,
            original_url: url.originalUrl,
            short_url: url.shortUrl,
            hit_count: url.hitCount,
            expires_at: url.expiresAt,
            created_at: url.createdAt,
        };
    }
}
exports.UrlMapper = UrlMapper;
