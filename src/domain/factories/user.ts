import { User, UserPropsCreate, UserCreationParams, HashingAlgorithm } from "@domain/entities";
import { UserValidatorSimple } from "@domain/validators";
import { ValidationError } from "@domain/protocols/validators";
import { Either } from "@/helpers";
import * as crypto from "crypto";
import { IdProvider, PasswordProviderConfig } from "@domain/protocols/providers";

export class UserFactory {
    constructor(
        private readonly idProvider: IdProvider,
        private readonly passwordProviderConfig: PasswordProviderConfig
    ) {}

    async createProps(overrides: Partial<UserPropsCreate> = {}): Promise<UserPropsCreate> {
        const hashingAlgorithm = await HashingAlgorithm.create({
            props: { name: this.passwordProviderConfig.provider.method },
            idProvider: this.idProvider,
        });

        return {
            name: "Default User",
            email: "user@domain.com",
            password: await this.passwordProviderConfig.provider.hash(crypto.randomBytes(8).toString("base64")),
            hashSalt: overrides.hashSalt ?? this.passwordProviderConfig.salt,
            isActive: overrides.isActive ?? false,
            hashingAlgorithm: overrides.hashingAlgorithm ?? hashingAlgorithm,
            verificationTokens: overrides.verificationTokens ?? [],
            urls: overrides.urls ?? [],
            createdAt: overrides.createdAt ?? new Date(),
            updatedAt: overrides.updatedAt ?? new Date(),
            ...overrides,
        };
    }

    async createEntity(
        overrides: Partial<UserPropsCreate> = {},
        validator?: UserValidatorSimple
    ): Promise<Either<ValidationError<UserPropsCreate>[], User>> {
        const userProps = await this.createProps(overrides); // Aguarda a criação das propriedades

        const userCreationParams: UserCreationParams = {
            props: userProps,
            idProvider: this.idProvider,
            passwordProviderConfig: this.passwordProviderConfig,
            validator,
        };

        const user = await User.create(userCreationParams);
        return user;
    }
}
