import { UrlLog as UrlLogSequelize } from "@infra/database/sequelize/models";
import { UrlLog } from "@domain/entities";

export class UrlLogMapper {
    static toDomain(urlSequelize: UrlLogSequelize): UrlLog {
        const { id, ipAddress, userAgent, accessedAt, urlId, createdAt, updatedAt } = urlSequelize;

        const urlLogResult = UrlLog.create({
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

        const urlLog = urlLogResult.value as UrlLog;

        return urlLog;
    }
}
