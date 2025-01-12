import { UserRepository } from "@domain/protocols/repositories";
import { HashingAlgorithm, User, VerificationToken } from "@infra/database/sequelize/models";
import { User as UserDomain } from "@domain/entities";
import { UserMapper } from "@domain/mappers";

export class UserSequelizeRepository implements UserRepository {
    async save(data: UserDomain): Promise<void | number> {
        const [affectedCount, _] = await User.update(
            {
                id: data.id,
                name: data.name,
                email: data.email,
                password: data.password,
                hashSalt: data.hashSalt,
                isActive: data.isActive,
                hashingAlgorithm: {
                    id: data.hashingAlgorithm.id,
                    name: data.hashingAlgorithm.name,
                },
                verificationTokens: data.verificationTokens.map(verificationToken => ({
                    id: verificationToken.id,
                    token: verificationToken.token,
                    type: verificationToken.type,
                    expiresAt: verificationToken.expiresAt,
                })),
            },
            {
                where: { id: data.id },
                returning: true,
            }
        );

        if (affectedCount < 1) {
            return;
        }

        return affectedCount;
    }
    async create(data: UserDomain): Promise<UserDomain> {
        const createdUser = await User.create(
            {
                id: data.id,
                name: data.name,
                email: data.email,
                password: data.password,
                hashSalt: data.hashSalt,
                isActive: data.isActive,
                hashingAlgorithm: {
                    id: data.hashingAlgorithm.id,
                    name: data.hashingAlgorithm.name,
                },
                verificationTokens: data.verificationTokens.map(verificationToken => ({
                    id: verificationToken.id,
                    token: verificationToken.token,
                    type: verificationToken.type,
                    expiresAt: verificationToken.expiresAt,
                })),
            },
            {
                include: [HashingAlgorithm, VerificationToken],
            }
        );

        return UserMapper.toDomain(createdUser);
    }

    async findByEmail(email: string): Promise<UserDomain | null> {
        const foundUser = await User.findOne({
            where: {
                email,
            },
            include: [HashingAlgorithm, VerificationToken],
        });

        if (!foundUser) {
            return null;
        }

        return UserMapper.toDomain(foundUser);
    }
    async findById(id: string): Promise<UserDomain | null> {
        const foundUser = await User.findOne({
            where: { id },
            include: [HashingAlgorithm, VerificationToken],
        });

        if (!foundUser) {
            return null;
        }

        return UserMapper.toDomain(foundUser);
    }
    find<K extends keyof UserDomain>(field: K, value: UserDomain[K]): Promise<UserDomain[]> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<UserDomain[]> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
