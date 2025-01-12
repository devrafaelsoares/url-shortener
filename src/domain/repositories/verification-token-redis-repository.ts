import { VerificationTokenMemoryRepository } from "@domain/protocols/repositories";
import Redis from "@infra/database/redis";

export class VerificationTokenRedisRepository implements VerificationTokenMemoryRepository {
    async canSendToken(verificationTokenBlocked: string): Promise<boolean> {
        const isBlocked = await Redis.getClient().get(verificationTokenBlocked);
        return isBlocked ? true : false;
    }

    async addTemporaryHold(blockKey: string, value: string, blockDuration: number): Promise<void> {
        await Redis.getClient().set(blockKey, value, "EX", blockDuration);
    }

    async getWaitingTime(verificationTokenBlocked: string): Promise<number> {
        return await Redis.getClient().ttl(verificationTokenBlocked);
    }
}
