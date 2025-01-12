import { Url } from "@infra/database/sequelize/models";
import { Url as UrlDomain, User as UserDomain } from "@domain/entities";
import { UrlRepository } from "@domain/protocols/repositories";
import { UrlMapper } from "@domain/mappers";

export class UrlSequelizeRepository implements UrlRepository {
    async findByShortUrl(shortUrl: UrlDomain["shortUrl"]): Promise<UrlDomain | null> {
        const foundUrl = await Url.findOne({
            where: {
                shortUrl,
            },
        });

        return !foundUrl ? null : UrlMapper.toDomain(foundUrl);
    }

    async findPaginatedByUser(page: number = 1, limit: number = 10, userId: UserDomain["id"]): Promise<UrlDomain[]> {
        const foundUrls = await Url.findAll({
            offset: page - 1,
            limit,
            where: {
                userId,
            },
        });

        return foundUrls.map(UrlMapper.toDomain);
    }

    async countByUser(userId: UserDomain["id"]): Promise<number> {
        return await Url.count({ where: { userId } });
    }

    async findByOriginalUrl(originalUrl: UrlDomain["originalUrl"]): Promise<UrlDomain | null> {
        const foundUrl = await Url.findOne({
            where: {
                originalUrl,
            },
        });

        return !foundUrl ? null : UrlMapper.toDomain(foundUrl);
    }
    async findAll(): Promise<UrlDomain[]> {
        const foundUrls = await Url.findAll();

        return foundUrls.map(UrlMapper.toDomain);
    }

    async incrementAccessCount(urlId: UrlDomain["id"]): Promise<void> {
        await Url.increment("hit_count", {
            by: 1,
            where: {
                id: urlId,
            },
        });
    }

    async findById(id: UrlDomain["id"]): Promise<UrlDomain | null> {
        const foundUrl = await Url.findOne({
            where: {
                id,
            },
        });

        return !foundUrl ? null : UrlMapper.toDomain(foundUrl);
    }

    async findByUser(userId: UserDomain["id"]): Promise<UrlDomain[]> {
        const foundUrls = await Url.findAll({
            where: {
                userId,
            },
        });

        return foundUrls.map(UrlMapper.toDomain);
    }

    async create(url: UrlDomain): Promise<UrlDomain> {
        const createdUrl = await Url.create({
            id: url.id,
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            hitCount: url.hitCount,
            expiresAt: url.expiresAt,
            userId: url.userId,
        });

        return UrlMapper.toDomain(createdUrl);
    }

    reset(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
