import { IdProvider, PasswordProvider } from "@domain/protocols/providers";
import { Cuid2IdProvider, UuidV4IdProvider } from "@infra/providers/id";
import { ToBase62 } from "@infra/providers/to-base";
import { Url, UrlPropsCreate } from "./url";
import { UrlShortenerToBase } from "@infra/providers/url-shortener";
import { UrlValidatorSimple } from "@domain/validators";
import { UserFactory } from "@domain/factories";
import { BcryptPasswordProvider } from "@infra/providers/password";
import { User } from "./user";

describe("Url", () => {
    let idProvider: IdProvider;
    let toBaseProvider: ToBase62;
    let idProviderUrlShortener: IdProvider;
    let passwordProvider: PasswordProvider;
    let currentDate: Date;
    let urlValidatorSimple: UrlValidatorSimple;
    let userFactory: UserFactory;

    beforeEach(() => {
        idProvider = new Cuid2IdProvider();
        idProviderUrlShortener = new UuidV4IdProvider();
        toBaseProvider = new ToBase62();
        currentDate = new Date();
        urlValidatorSimple = new UrlValidatorSimple();
        passwordProvider = new BcryptPasswordProvider();
        userFactory = new UserFactory(idProvider, { provider: passwordProvider });
    });

    it("should be able to create a Url", async () => {
        const userResult = await userFactory.createEntity();
        const user = userResult.value as User;

        const urlPropsCreate: UrlPropsCreate = {
            originalUrl: "https://google.com/",
            expiresAt: new Date(currentDate.setMinutes(5)),
            userId: user.id,
            user,
        };

        const urlResult = Url.create({
            props: urlPropsCreate,
            providers: {
                idProvider,
                urlShortenerProvider: new UrlShortenerToBase(toBaseProvider, idProviderUrlShortener),
            },
            validator: urlValidatorSimple,
        });

        const url = urlResult.value as Url;

        expect(url).toStrictEqual(expect.any(Url));
    });

    it("should not be able to crate a Url", async () => {
        const userResult = await userFactory.createEntity();
        const user = userResult.value as User;

        const urlPropsCreate: UrlPropsCreate = {
            originalUrl: "",
            expiresAt: new Date(currentDate.setMinutes(5)),
            userId: user.id,
            user,
        };

        const urlResult = Url.create({
            props: urlPropsCreate,
            providers: {
                idProvider,
                urlShortenerProvider: new UrlShortenerToBase(toBaseProvider, idProviderUrlShortener),
            },
            validator: urlValidatorSimple,
        });

        expect(urlResult.isError()).toBeTruthy();
        expect(urlResult.value).toEqual([
            {
                path: "originalUrl",
                message: "A url original é obrigatório",
            },
        ]);
    });
});
