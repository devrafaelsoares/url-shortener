import { Either, error, Replace, success } from "@/helpers";
import { ValidationError, Validator } from "@domain/protocols/validators";
import { IdProvider, PasswordProviderConfig } from "@domain/protocols/providers";
import { HashingAlgorithm } from "./hashing-algorithm";
import { VerificationToken } from "./verification-token";
import { Url } from "./url";

export type UserProps = {
    name: string;
    email: string;
    password: string;
    hashSalt: string;
    isActive: boolean;
    hashingAlgorithm: HashingAlgorithm;
    verificationTokens: VerificationToken[];
    urls: Url[];
    createdAt: Date;
    updatedAt: Date;
};

export type UserPropsCreate = Replace<
    UserProps,
    {
        urls?: Url[];
        verificationTokens?: VerificationToken[];
        hashSalt?: string;
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }
>;

export type UserProviders = {
    idProvider?: IdProvider;
};

export type UserCreationParams = {
    props: UserPropsCreate;
    idProvider?: IdProvider;
    passwordProviderConfig?: PasswordProviderConfig;
    validator?: Validator<UserPropsCreate>;
    id?: string;
};
export class User implements UserProps {
    private _id: string;
    private props: UserProps;

    private constructor(props: UserPropsCreate, providers: UserProviders, id?: string) {
        this._id = id || providers.idProvider!.generate();
        const date = User.getCurrentDateWithGmt();

        this.props = {
            ...props,
            urls: props.urls || [],
            verificationTokens: props.verificationTokens || [],
            isActive: props.isActive ?? false,
            hashSalt: props.hashSalt || "",
            createdAt: props.createdAt ?? date,
            updatedAt: props.updatedAt ?? date,
        };
    }

    static async create(params: UserCreationParams): Promise<Either<ValidationError<UserPropsCreate>[], User>> {
        const { props, idProvider, passwordProviderConfig, validator, id } = params;

        if (validator) {
            const validationErrors = validator.validate(props);
            if (validationErrors.length > 0) return error(validationErrors);
        }

        if (passwordProviderConfig) {
            props.password = await passwordProviderConfig.provider.hash(props.password, passwordProviderConfig.salt);
            props.hashSalt = passwordProviderConfig.salt;
        }

        return success(new User(props, { idProvider }, id));
    }

    static getCurrentDateWithGmt(): Date {
        const currentDate = new Date();
        const gmtOffset = -3 * 60 * 60 * 1000;
        return new Date(currentDate.getTime() + gmtOffset);
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this.props.name;
    }

    get email(): string {
        return this.props.email;
    }

    get password(): string {
        return this.props.password;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get hashingAlgorithm(): HashingAlgorithm {
        return this.props.hashingAlgorithm;
    }

    get verificationTokens(): VerificationToken[] {
        return this.props.verificationTokens;
    }

    get urls(): Url[] {
        return this.props.urls;
    }

    get hashSalt(): string {
        return this.props.hashSalt;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    async setPassword(newPassword: string, passwordProviderConfig: PasswordProviderConfig): Promise<void> {
        const hashedPassword = await passwordProviderConfig.provider.hash(newPassword, passwordProviderConfig.salt);
        this.props.password = hashedPassword;
        this.props.hashSalt = passwordProviderConfig.salt || "";
        this.props.updatedAt = User.getCurrentDateWithGmt();
    }

    activate(): void {
        this.props.isActive = true;
    }

    addVerificationToken(token: VerificationToken): void {
        this.props.verificationTokens.push(token);
    }

    removeLastVerificationToken(): VerificationToken | undefined {
        return this.props.verificationTokens.pop();
    }

    addUrl(url: Url): void {
        this.props.urls.push(url);
    }
}
