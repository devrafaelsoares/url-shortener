import { Url } from "@domain/entities";

export interface UrlMemoryRepository {
    incrementAccessCount(urlId: Url["id"]): Promise<void>;
}
