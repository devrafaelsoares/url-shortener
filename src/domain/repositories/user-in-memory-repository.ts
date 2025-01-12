import { UserRepository } from "@domain/protocols/repositories";
import { User } from "@domain/entities";

export class UserInMemoryRepository implements UserRepository {
    private users: User[] = [];

    async save(data: User): Promise<void | number> {
        const userFoundIndex = this.users.findIndex(user => user.id === data.id);

        if (userFoundIndex >= 0) {
            this.users[userFoundIndex] = data;
            return 1;
        }
    }
    async create(data: User): Promise<User> {
        this.users.push(data);
        return data;
    }
    async findById(id: string): Promise<User | null> {
        const userFound = this.users.find(user => user.id === id);

        if (!userFound) {
            return null;
        }

        return userFound;
    }

    async findByEmail(email: string): Promise<User | null> {
        const userFound = this.users.find(user => user.email === email);

        if (!userFound) {
            return null;
        }

        return userFound;
    }

    async find<K extends keyof User>(field: K, value: User[K]): Promise<User[] | null> {
        if (field === "password") {
            return null;
        }
        const foundUser = this.users.filter(user => user[field] === value);

        return !foundUser.length ? null : foundUser;
    }

    async findAll(): Promise<User[]> {
        return this.users;
    }

    async delete(id: string): Promise<void> {
        const userFoundIndex = this.users.findIndex(user => user.id === id);
        if (userFoundIndex >= 0) {
            this.users.splice(userFoundIndex, 1);
        }
    }
}
