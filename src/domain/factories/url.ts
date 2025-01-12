import { Url, UrlPropsCreate } from "@domain/entities";
import { UrlValidatorSimple } from "@domain/validators";
import { ValidationError } from "@domain/protocols/validators";
import { UrlShortenerToBase } from "@infra/providers/url-shortener";
import { ToBase62 } from "@infra/providers/to-base";
import { Cuid2IdProvider, UuidV4IdProvider } from "@infra/providers/id";

export class UrlFactory {
    createProps(overrides: Partial<UrlPropsCreate> = {}): UrlPropsCreate {
        return {
            originalUrl: "Url title",
            expiresAt: new Date(),
            ...overrides,
        };
    }

    createEntity(overrides: Partial<UrlPropsCreate> = {}): ValidationError<UrlPropsCreate>[] | Url {
        const urlProps = this.createProps({ ...overrides });

        const urlValidatorSimple = new UrlValidatorSimple();
        const url = Url.create({
            props: urlProps,
            providers: {
                idProvider: new Cuid2IdProvider(),
                urlShortenerProvider: new UrlShortenerToBase(new ToBase62(), new UuidV4IdProvider()),
            },
            validator: urlValidatorSimple,
        });
        return url.value;
    }
}
