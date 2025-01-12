import {
    IdProvider,
    PasswordProvider,
    PasswordProviderConfig,
} from "@domain/protocols/providers";
import { BcryptPasswordProvider } from "@infra/providers/password";
import { UserInMemoryRepository } from "./user-in-memory-repository";
import { UserFactory } from "@domain/factories";
import { User } from "@domain/entities";
import { Cuid2IdProvider } from "@infra/providers/id";

describe("UserInMemoryRepository", () => {
    let userInMemoryRepository: UserInMemoryRepository;
    let passwordProvider: PasswordProvider;
    let userFactory: UserFactory;
    let idProvider: IdProvider;

    beforeEach(async () => {
        userInMemoryRepository = new UserInMemoryRepository();
        passwordProvider = new BcryptPasswordProvider();

        idProvider = new Cuid2IdProvider();
        const passwordProviderConfig: PasswordProviderConfig = {
            provider: passwordProvider,
            salt: await passwordProvider.salt(),
        };

        userFactory = new UserFactory(idProvider, passwordProviderConfig);
    });

    it("should be able to create a user", async () => {
        const userResult = await userFactory.createEntity();
        if (userResult.isSuccess()) {
            const user = userResult.value as User;
            const savedUser = await userInMemoryRepository.create(user);

            expect(savedUser).toStrictEqual(expect.any(User));
        }
    });
});
