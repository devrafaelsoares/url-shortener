import { Replace } from "@/helpers";
import { IdProvider, TokenProvider } from "@domain/protocols/providers";
import { User } from "./user";

export enum VerificationTokenTypes {
    CONFIRMATION_EMAIL = "CONFIRMATION_EMAIL",
    PASSWORD_RECOVERY = "PASSWORD_RECOVERY",
}

export type VerificationTokenProps = {
    token: string;
    type: VerificationTokenTypes;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
};

export type VerificationTokenPropsCreate = Replace<
    VerificationTokenProps,
    {
        createdAt?: Date;
        updatedAt?: Date;
    }
>;

export type VerificationTokenProviders = {
    idProvider?: IdProvider;
    tokenProvider?: TokenProvider;
};

export type VerificationTokenCreationParams = {
    props: VerificationTokenPropsCreate;
    idProvider?: IdProvider;
    tokenProvider?: TokenProvider;
    id?: string;
};

export class VerificationToken implements VerificationTokenProps {
    private _id: string;
    private props: VerificationTokenProps;

    private constructor(props: VerificationTokenPropsCreate, providers: VerificationTokenProviders, id?: string) {
        this._id = id || providers.idProvider!.generate();
        const date = User.getCurrentDateWithGmt();

        this.props = {
            ...props,
            createdAt: props.createdAt ?? date,
            updatedAt: props.updatedAt ?? date,
        };
    }

    static async create(params: VerificationTokenCreationParams): Promise<VerificationToken> {
        const { props, idProvider, tokenProvider, id } = params;

        return new VerificationToken(props, { idProvider, tokenProvider }, id);
    }

    get id(): string {
        return this._id;
    }
    get token(): string {
        return this.props.token;
    }
    get type(): VerificationTokenTypes {
        return this.props.type;
    }
    get expiresAt(): Date {
        return this.props.expiresAt;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    isExpired(): boolean {
        return new Date() > this.props.expiresAt;
    }
}
