import { User } from "@infra/database/sequelize/models";
import { VerificationToken } from "@domain/entities";

export interface VerificationTokenRepository {
    findByToken(token: VerificationToken["token"]): Promise<VerificationToken | null>;
    create(verificationToken: VerificationToken, userId: User["id"]): Promise<VerificationToken | null>;
    delete(id: VerificationToken["id"]): Promise<void>;
    deleteByToken(token: VerificationToken["token"]): Promise<void>;
}
