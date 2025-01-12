import { User } from "@domain/entities";
import { EntityRepository } from "./entity-repository";

export interface UserRepository extends EntityRepository<User, User> {
    findByEmail(email: User["email"]): Promise<User | null>;
}
