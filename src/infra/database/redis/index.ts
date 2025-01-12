import Redis from "ioredis";
import env from "@env";

class RedisClient {
    private client: Redis | null = null;

    public connect() {
        if (!this.client) {
            this.client = new Redis({
                host: env.REDIS_HOST,
                port: env.REDIS_PORT,
                password: env.REDIS_PASSWORD,
            });
            console.log("Console> 🔰 Redis connected");
        }
    }

    public disconnect() {
        if (this.client) {
            this.client.quit();
            this.client = null;
            console.log("Console> ❌ Redis disconnected");
        }
    }

    public getClient(): Redis {
        if (!this.client) {
            throw new Error("Redis is not initialized. Call `connect()` first.");
        }
        return this.client;
    }
}

export default new RedisClient();
