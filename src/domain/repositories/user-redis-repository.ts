import { UserMemoryRepository } from "@domain/protocols/repositories";
import Redis from "@infra/database/redis";

export class UserRedisRepository implements UserMemoryRepository {
    async userHasAccountBlocked(userAccountBlockedId: string): Promise<boolean> {
        const isBlocked = await Redis.getClient().get(userAccountBlockedId);
        return isBlocked ? true : false;
    }

    async addNewAttemptFails(attemptsKey: string): Promise<number> {
        const attempts = await Redis.getClient().incr(attemptsKey);
        return attempts;
    }

    async addAttemptLock(attemptsKey: string, blockDuration: number): Promise<void> {
        await Redis.getClient().expire(attemptsKey, blockDuration);
    }

    async addTemporaryBlock(blockKey: string, value: string, blockDuration: number): Promise<void> {
        await Redis.getClient().set(blockKey, value, "EX", blockDuration);
    }

    async removeAttemptLock(attemptsKey: string): Promise<void> {
        await Redis.getClient().del(attemptsKey);
    }
}
