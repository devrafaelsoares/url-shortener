import { Url, User } from "@domain/entities";

export interface UrlRepository {
    findByShortUrl(shortUrl: Url["shortUrl"]): Promise<Url | null>;
    findByOriginalUrl(originalUrl: Url["originalUrl"]): Promise<Url | null>;
    findById(id: Url["id"]): Promise<Url | null>;
    findByUser(userId: User["id"]): Promise<Url[]>;
    findPaginatedByUser(page: number, limit: number, userId: User["id"]): Promise<Url[]>;
    countByUser(userId: User["id"]): Promise<number>;
    findAll(): Promise<Url[]>;
    incrementAccessCount(urlId: Url["id"]): Promise<void>;
    create(url: Url): Promise<Url>;
    reset(): Promise<void>;
}
