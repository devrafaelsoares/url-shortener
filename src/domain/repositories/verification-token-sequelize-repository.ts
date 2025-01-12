import { VerificationTokenRepository } from "@domain/protocols/repositories";
import { VerificationToken as VerificationTokenDomain } from "@domain/entities";
import { User, VerificationToken } from "@infra/database/sequelize/models";
import { VerificationTokenMapper } from "@domain/mappers";

export class VerificationTokenSequelizeRepository
    implements VerificationTokenRepository
{
    async create(
        verificationToken: VerificationTokenDomain,
        userId: string
    ): Promise<VerificationTokenDomain | null> {
        const verificationTokenCreated = await VerificationToken.create({
            id: verificationToken.id,
            token: verificationToken.token,
            type: verificationToken.type,
            expiresAt: verificationToken.expiresAt,
            userId: userId,
        });
        return VerificationTokenMapper.toDomain(verificationTokenCreated);
    }
    async findByToken(token: string): Promise<VerificationTokenDomain | null> {
        const foundVerificationToken = await VerificationToken.findOne({
            where: {
                token,
            },
            include: [User],
        });

        if (!foundVerificationToken) {
            return null;
        }

        return VerificationTokenMapper.toDomain(foundVerificationToken);
    }

    async delete(id: string): Promise<void> {
        await VerificationToken.destroy({ where: { id } });
    }

    async deleteByToken(token: string): Promise<void> {
        await VerificationToken.destroy({ where: { token } });
    }
}
