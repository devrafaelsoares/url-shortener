import redisClient from "@infra/database/redis";
import { Url } from "@domain/entities";
import { UrlMemoryRepository } from "@domain/protocols/repositories";

export class UrlRedisRepository implements UrlMemoryRepository {
    async incrementAccessCount(urlId: Url["id"]): Promise<void> {
        const redisKey = `url:access_count:${urlId}`;
        await redisClient.getClient().incr(redisKey);
    }

    async findByShortUrl(shortUrl: string): Promise<Url | null> {
        const redisKey = `url:short:${shortUrl}`;
        const data = await redisClient.getClient().get(redisKey);
        if (!data) return null;
        try {
            const parsed = JSON.parse(data);
            // Reconstruct the domain object
            const urlResult = Url.create({
                props: {
                    originalUrl: parsed.originalUrl,
                    shortUrl: parsed.shortUrl,
                    hitCount: parsed.hitCount,
                    expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : undefined,
                    userId: parsed.userId,
                    user: parsed.user,
                    createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
                    updatedAt: parsed.updatedAt ? new Date(parsed.updatedAt) : new Date(),
                },
                id: parsed.id,
            });

            return urlResult.value as Url;
        } catch (e) {
            return null;
        }
    }

    async save(url: Url): Promise<void> {
        const redisKey = `url:short:${url.shortUrl}`;
        const payload = JSON.stringify({
            id: url.id,
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            hitCount: url.hitCount,
            expiresAt: url.expiresAt,
            userId: url.userId,
            user: url.user,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt,
        });
        // Cache por 1 semana
        await redisClient.getClient().set(redisKey, payload, 'EX', 604800);
    }
}
