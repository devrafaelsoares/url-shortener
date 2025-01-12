import redisClient from "@infra/database/redis";
import { Url } from "@domain/entities";
import { UrlMemoryRepository } from "@domain/protocols/repositories";

export class UrlRedisRepository implements UrlMemoryRepository {
    async incrementAccessCount(urlId: Url["id"]): Promise<void> {
        const redisKey = `url:access_count:${urlId}`;
        await redisClient.getClient().incr(redisKey);
    }
}
