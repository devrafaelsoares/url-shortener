import { UrlRepository } from "@domain/protocols/repositories";
import { Url, User } from "@domain/entities";

export class UrlInMemoryRepository implements UrlRepository {
    private urls: Url[] = [];

    async findPaginatedByUser(page: number, limit: number, userId: User["id"]): Promise<Url[]> {
        return this.urls.filter(url => url.userId === userId).slice((page - 1) * limit, page * limit);
    }

    async countByUser(userId: User["id"]): Promise<number> {
        return this.urls.filter(url => url.userId === userId).length;
    }

    async findByShortUrl(shortUrl: Url["shortUrl"]): Promise<Url | null> {
        const foundUrl = this.urls.find(url => url.shortUrl === shortUrl);

        return !foundUrl ? null : foundUrl;
    }
    async findByOriginalUrl(originalUrl: Url["originalUrl"]): Promise<Url | null> {
        const foundUrl = this.urls.find(url => url.originalUrl === originalUrl);

        return !foundUrl ? null : foundUrl;
    }

    async create(url: Url): Promise<Url> {
        this.urls.push(url);

        return url;
    }

    async findById(id: Url["id"]): Promise<Url | null> {
        const foundUrl = this.urls.find(url => url.id === id);

        return !foundUrl ? null : foundUrl;
    }

    async findByUser(userId: Url["id"]): Promise<Url[]> {
        const foundUrls = this.urls.filter(url => url.userId === userId);

        return foundUrls;
    }

    async incrementAccessCount(urlId: Url["id"]): Promise<void> {
        const foundIndexUrl = this.urls.findIndex(url => url.id === urlId);
        this.urls[foundIndexUrl].hitCount++;
    }

    async findAll(): Promise<Url[]> {
        return this.urls;
    }

    async reset(): Promise<void> {
        while (this.urls.length > 0) {
            this.urls.pop();
        }
    }
}
