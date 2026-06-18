import { Url } from "@domain/entities";

export interface UrlMemoryRepository {
    incrementAccessCount(urlId: Url["id"]): Promise<void>;
    findByShortUrl(shortUrl: string): Promise<Url | null>;
    save(url: Url): Promise<void>;
}
