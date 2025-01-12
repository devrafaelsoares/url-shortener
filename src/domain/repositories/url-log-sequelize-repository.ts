import { UrlLogRepository } from "@domain/protocols/repositories";
import { UrlLog as UrlLogDomain } from "@domain/entities";
import { UrlLog } from "@infra/database/sequelize/models";
import { UrlLogMapper } from "@domain/mappers";

export class UrlLogSequelizeRepository implements UrlLogRepository {
    async create(urlLog: UrlLogDomain): Promise<UrlLogDomain> {
        const createdUrlLog = await UrlLog.create({
            id: urlLog.id,
            ipAddress: urlLog.ipAddress,
            userAgent: urlLog.userAgent,
            accessedAt: urlLog.accessedAt,
            urlId: urlLog.urlId,
        });

        return UrlLogMapper.toDomain(createdUrlLog);
    }
}
