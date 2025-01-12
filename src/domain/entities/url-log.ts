import { Either, error, Replace, success } from "@/helpers";
import { ValidationError, Validator } from "@domain/protocols/validators";
import { IdProvider } from "@domain/protocols/providers";
import { Url } from "./url";

export type UrlLogProps = {
    ipAddress: string;
    userAgent: string;
    accessedAt: Date;
    urlId: string;
    url?: Url;
    createdAt: Date;
    updatedAt: Date;
};

export type UrlLogProviders = {
    idProvider?: IdProvider;
};

export type UrlLogPropsCreate = Replace<
    UrlLogProps,
    {
        url?: Url;
        userAgent?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }
>;

export type UrlLogCreateParams = {
    props: UrlLogPropsCreate;
    validator?: Validator<UrlLogPropsCreate>;
    providers?: UrlLogProviders;
    id?: string;
};

export class UrlLog implements UrlLogProps {
    private _id: string;
    private props: UrlLogProps;

    private constructor(props: UrlLogPropsCreate, providers?: UrlLogProviders, id?: string) {
        this._id = providers ? providers.idProvider!.generate() : id!;

        const currentDate = new Date();
        const gmt = -3 * 60 * 60 * 1000;

        const date = new Date(currentDate.getTime() + gmt);

        this.props = {
            ...props,
            userAgent: props.userAgent ?? "",
            createdAt: props.createdAt ?? date,
            updatedAt: props.createdAt ?? date,
        };
    }

    static create(params: UrlLogCreateParams): Either<ValidationError<UrlLogPropsCreate>[], UrlLog> {
        const { props, providers, validator, id } = params;

        if (validator) {
            const validationErrors: ValidationError<UrlLogPropsCreate>[] = validator.validate(props);

            if (validationErrors.length > 0) {
                return error(validationErrors);
            }
        }

        if (providers) {
            const { idProvider } = providers;
            return success(new UrlLog(props, { idProvider }, id));
        }

        return success(new UrlLog(props, undefined, id));
    }

    get id(): string {
        return this._id;
    }

    get ipAddress(): string {
        return this.props.ipAddress;
    }

    set ipAddress(ipAddress: string) {
        this.props.ipAddress = ipAddress;
    }

    get userAgent(): string {
        return this.props.userAgent;
    }

    set userAgent(userAgent: string) {
        this.props.userAgent = userAgent;
    }

    get accessedAt(): Date {
        return this.props.accessedAt;
    }

    set accessedAt(accessedAt: Date) {
        this.props.accessedAt = accessedAt;
    }

    get urlId(): string {
        return this.props.urlId;
    }

    get url(): Url | undefined {
        return this.props.url;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
