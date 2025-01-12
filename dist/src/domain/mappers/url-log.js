"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlLogMapper = void 0;
const entities_1 = require("../entities");
class UrlLogMapper {
    static toDomain(urlSequelize) {
        const { id, ipAddress, userAgent, accessedAt, urlId, createdAt, updatedAt } = urlSequelize;
        const urlLogResult = entities_1.UrlLog.create({
            props: {
                ipAddress,
                userAgent,
                accessedAt,
                urlId,
                createdAt,
                updatedAt,
            },
            providers: undefined,
            validator: undefined,
            id,
        });
        const urlLog = urlLogResult.value;
        return urlLog;
    }
}
exports.UrlLogMapper = UrlLogMapper;
