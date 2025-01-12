import { Cuid2IdProvider, UuidV4IdProvider } from "@infra/providers/id";
import { ToBase62 } from "@infra/providers/to-base";
import { IdProvider } from "@domain/protocols/providers";
import { UrlValidatorSimple } from "@domain/validators";
import { UrlFactory } from "@domain/factories";
import { UrlRepository } from "@domain/protocols/repositories";
import { UrlInMemoryRepository } from "./url-in-memory-repository";
import { Url } from "@domain/entities";

describe("UrlInMemoryRepository", () => {
    let idProvider: IdProvider;
    let toBaseProvider: ToBase62;
    let idProviderUrlShortener: IdProvider;
    let currentDate: Date;
    let urlValidatorSimple: UrlValidatorSimple;
    let urlFactory: UrlFactory;
    let urlRepository: UrlRepository;

    beforeEach(() => {
        idProvider = new Cuid2IdProvider();
        idProviderUrlShortener = new UuidV4IdProvider();
        toBaseProvider = new ToBase62();
        currentDate = new Date();
        urlValidatorSimple = new UrlValidatorSimple();
        urlFactory = new UrlFactory();
        urlRepository = new UrlInMemoryRepository();
    });

    it("should be able to create a url", async () => {
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + expiresAt.getTimezoneOffset() * -60 * 1000);
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        await urlRepository.reset();

        const url = urlFactory.createEntity({
            originalUrl: "https://teste.com",
            expiresAt,
        }) as Url;

        await urlRepository.create(url);

        const foundUrls = await urlRepository.findAll();

        expect(foundUrls).toHaveLength(1);
    });

    it("should be able to find url by short url", async () => {
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + expiresAt.getTimezoneOffset() * -60 * 1000);
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        await urlRepository.reset();

        const url = urlFactory.createEntity({
            originalUrl: "https://teste.com",
            expiresAt,
        }) as Url;

        await urlRepository.create(url);

        const shortUrl = url.shortUrl;

        const foundUrl = await urlRepository.findByShortUrl(shortUrl);

        expect(foundUrl).not.toBeNull();
    });

    it("should be able to find url by original url", async () => {
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + expiresAt.getTimezoneOffset() * -60 * 1000);
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        await urlRepository.reset();

        const url = urlFactory.createEntity({
            originalUrl: "https://teste.com",
            expiresAt,
        }) as Url;

        await urlRepository.create(url);

        const originalUrl = url.originalUrl;

        const foundUrl = await urlRepository.findByOriginalUrl(originalUrl);

        expect(foundUrl).not.toBeNull();
    });
});
