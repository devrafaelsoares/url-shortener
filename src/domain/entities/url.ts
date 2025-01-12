import { Either, error, Replace, success } from "@/helpers";
import { ValidationError, Validator } from "@domain/protocols/validators";
import { IdProvider, UrlShortenerProvider } from "@domain/protocols/providers";
import { User } from "./user";

export type UrlProps = {
    shortUrl: string;
    originalUrl: string;
    hitCount: number;
    expiresAt: Date | null;
    userId: string | null;
    user?: User | null;
    createdAt: Date;
    updatedAt: Date;
};

export type UrlProviders = {
    idProvider?: IdProvider;
    urlShortenerProvider: UrlShortenerProvider;
};

export type UrlPropsCreate = Replace<
    UrlProps,
    {
        user?: User;
        userId?: string;
        expiresAt?: Date;
        shortUrl?: string;
        hitCount?: number;
        createdAt?: Date;
        updatedAt?: Date;
    }
>;

export type UrlCreateParams = {
    props: UrlPropsCreate;
    validator?: Validator<UrlPropsCreate>;
    providers?: UrlProviders;
    id?: string;
};

export class Url implements UrlProps {
    private _id: string;
    private props: UrlProps;

    private constructor(props: UrlPropsCreate, providers?: UrlProviders, id?: string) {
        this._id = providers ? providers.idProvider!.generate() : id!;

        const currentDate = new Date();
        const gmt = -3 * 60 * 60 * 1000;

        const date = new Date(currentDate.getTime() + gmt);

        this.props = {
            ...props,
            userId: props.userId ?? null,
            shortUrl: props.shortUrl ?? providers!.urlShortenerProvider.shorten(),
            expiresAt: props.expiresAt ?? null,
            hitCount: props.hitCount ?? 0,
            createdAt: props.createdAt ?? date,
            updatedAt: props.createdAt ?? date,
        };
    }

    static create(params: UrlCreateParams): Either<ValidationError<UrlPropsCreate>[], Url> {
        const { props, providers, validator, id } = params;

        if (validator) {
            const validationErrors: ValidationError<UrlPropsCreate>[] = validator.validate(props);

            if (validationErrors.length > 0) {
                return error(validationErrors);
            }
        }

        if (providers) {
            const { idProvider, urlShortenerProvider } = providers;
            return success(new Url(props, { idProvider, urlShortenerProvider }, id));
        }

        return success(new Url(props, undefined, id));
    }

    get id(): string {
        return this._id;
    }

    get shortUrl(): string {
        return this.props.shortUrl;
    }

    set shortUrl(shortUrl: string) {
        this.props.shortUrl = shortUrl;
    }

    get originalUrl(): string {
        return this.props.originalUrl;
    }

    set originalUrl(originalUrl: string) {
        this.props.originalUrl = originalUrl;
    }

    get hitCount(): number {
        return this.props.hitCount;
    }

    set hitCount(hitCount: number) {
        this.props.hitCount = hitCount;
    }

    set expiresAt(expiresAt: Date) {
        this.props.expiresAt = expiresAt;
    }

    get expiresAt(): Date | null {
        return this.props.expiresAt;
    }

    set userId(userId: string) {
        this.props.userId = userId;
    }

    get userId(): string | null {
        return this.props.userId;
    }

    set user(user: User) {
        this.props.user = user;
    }

    get user(): User | null | undefined {
        return this.props.user;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
