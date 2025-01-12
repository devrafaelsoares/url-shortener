import { User as UserSequelize } from "@infra/database/sequelize/models";
import { UserCreateResponseProps, UserResponseProps } from "@presentation/adpaters/user";
import {
    HashingAlgorithm,
    HashingAlgorithmPropsCreate,
    User,
    VerificationToken,
    VerificationTokenTypes,
} from "@domain/entities";

export class UserMapper {
    static async toDomain(userSequelize: UserSequelize): Promise<User> {
        const {
            id,
            name,
            email,
            password,
            hashSalt,
            isActive,
            hashingAlgorithm,
            verificationTokens,
            createdAt,
            updatedAt,
        } = userSequelize;

        const hashingAlgorithmProps: HashingAlgorithmPropsCreate = {
            name: hashingAlgorithm.name,
            createdAt: hashingAlgorithm.createdAt,
            updatedAt: hashingAlgorithm.updatedAt,
        };

        const hashingAlgorithmResult = await HashingAlgorithm.create({
            props: hashingAlgorithmProps,
            id: hashingAlgorithm.id,
        });

        const userResult = await User.create({
            props: {
                name,
                email,
                hashingAlgorithm: hashingAlgorithmResult,
                password,
                isActive,
                hashSalt,
                verificationTokens: await Promise.all(
                    verificationTokens.map(
                        async verificationToken =>
                            await VerificationToken.create({
                                props: {
                                    expiresAt: verificationToken.expiresAt,
                                    token: verificationToken.token,
                                    type: verificationToken.type as VerificationTokenTypes,
                                    createdAt: verificationToken.createdAt,
                                    updatedAt: verificationToken.updatedAt,
                                },
                                id: verificationToken.id,
                            })
                    )
                ),
                createdAt,
                updatedAt,
            },
            id,
        });

        const user = userResult.value as User;
        return user;
    }

    static toHttpResponseUser(user: User): UserResponseProps {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: user.createdAt,
        };
    }

    static toHttpResponseUserCreate(user: User): UserCreateResponseProps {
        const token = user.verificationTokens
            .filter(token => token.type === VerificationTokenTypes.CONFIRMATION_EMAIL)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].token;

        return {
            id: user.id,
            token,
        };
    }
}
