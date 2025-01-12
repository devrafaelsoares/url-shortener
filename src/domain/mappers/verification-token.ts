import { VerificationToken as VerificationTokenSequelize } from "@infra/database/sequelize/models";
import { VerificationToken, VerificationTokenTypes } from "@domain/entities";

export class VerificationTokenMapper {
    static async toDomain(
        verificationTokenSequelize: VerificationTokenSequelize
    ): Promise<VerificationToken> {
        const { id, token, type, expiresAt, createdAt, updatedAt, user } =
            verificationTokenSequelize;

        const verifcationTokenResult = VerificationToken.create({
            props: {
                token,
                type: type as VerificationTokenTypes,
                expiresAt,
                createdAt,
                updatedAt,
            },
            id,
        });

        const verifcationToken = await verifcationTokenResult;

        return verifcationToken;
    }
}
