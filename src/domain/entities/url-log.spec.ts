import { IdProvider } from "@domain/protocols/providers";
import { Cuid2IdProvider } from "@infra/providers/id";
import { Url } from "./url";
import { UrlFactory } from "@domain/factories";
import { UrlLog, UrlLogPropsCreate } from "./url-log";
import { Validator } from "@domain/protocols/validators";
import { UrlLogValidatorSimple } from "@domain/validators";

describe("UrlLog", () => {
    let idProvider: IdProvider;
    let currentDate: Date;
    let urlFactory: UrlFactory;
    let urlLogValidator: Validator<UrlLogPropsCreate>;

    beforeEach(() => {
        idProvider = new Cuid2IdProvider();
        currentDate = new Date();
        urlFactory = new UrlFactory();
        urlLogValidator = new UrlLogValidatorSimple();
    });

    it("should be able to create a url log", () => {
        const url = urlFactory.createEntity({
            originalUrl: "https://teste.com",
        }) as Url;

        const urlLogProps: UrlLogPropsCreate = {
            ipAddress: "207.69.0.114",
            accessedAt: new Date(),
            userAgent: "Mozilla/5.0",
            urlId: url.id,
            url: url,
        };

        const urlLogResult = UrlLog.create({
            props: urlLogProps,
            providers: { idProvider },
            validator: urlLogValidator,
        });
        const urlLog = urlLogResult.value as UrlLog;

        expect(urlLog).toStrictEqual(expect.any(UrlLog));
    });

    it("should not be able to crate a url log", async () => {
        const url = urlFactory.createEntity({
            originalUrl: "https://teste.com",
        }) as Url;

        const urlLogProps: UrlLogPropsCreate = {
            ipAddress: "ip adddress",
            accessedAt: new Date(),
            userAgent: "Mozilla/5.0",
            urlId: url.id,
            url: url,
        };

        const urlLogResult = UrlLog.create({
            props: urlLogProps,
            providers: { idProvider },
            validator: urlLogValidator,
        });

        expect(urlLogResult.isError()).toBeTruthy();
        expect(urlLogResult.value).toEqual([
            {
                path: "ipAddress",
                message: "Endereço ip informado é inválido",
            },
        ]);
    });
});
