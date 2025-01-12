import { UserValidatorSimple } from "@domain/validators";
import { User, UserPropsCreate } from "./user";
import { IdProvider, PasswordProvider, TokenProvider } from "@domain/protocols/providers";
import { BcryptPasswordProvider } from "@infra/providers/password";
import { Cuid2IdProvider } from "@infra/providers/id";
import { HashingAlgorithm, HashingAlgorithmPropsCreate } from "./hashing-algorithm";
import { JwtToken } from "@infra/providers/token";
import { VerificationToken, VerificationTokenTypes } from "./verification-token";
import env from "@env";

describe("User", () => {
    let userValidator: UserValidatorSimple;
    let passwordProvider: PasswordProvider;
    let idProvider: IdProvider;
    let confirmationEmailTokenProvider: TokenProvider;

    beforeEach(() => {
        idProvider = new Cuid2IdProvider();
        passwordProvider = new BcryptPasswordProvider();
        confirmationEmailTokenProvider = new JwtToken({ secret: env.SECRET_KEY_TOKEN, expirationTime: "1h" });
        userValidator = new UserValidatorSimple();
    });

    it("should be able to create a User", async () => {
        const hashingAlgorithmProps: HashingAlgorithmPropsCreate = {
            name: passwordProvider.method,
        };

        const hashingAlgorithm = await HashingAlgorithm.create({
            idProvider,
            props: hashingAlgorithmProps,
        });

        const userProps: UserPropsCreate = {
            email: "tetse01@gmail.com",
            hashingAlgorithm,
            verificationTokens: [],
            urls: [],
            password: "12345678",
            name: "Teste 01",
        };

        const userResult = await User.create({
            props: userProps,
            idProvider: idProvider,
            passwordProviderConfig: {
                provider: passwordProvider,
                salt: await passwordProvider.salt(),
            },
            validator: userValidator,
        });

        const user = userResult.value as User;

        const { token, expiresAt } = confirmationEmailTokenProvider.generate();

        const verificationToken = await VerificationToken.create({
            props: {
                token,
                expiresAt,
                type: VerificationTokenTypes.CONFIRMATION_EMAIL,
            },
            idProvider,
            tokenProvider: confirmationEmailTokenProvider,
        });

        user.addVerificationToken(verificationToken);

        expect(user).toStrictEqual(expect.any(User));
    });

    it("should not be able to crate a User", async () => {
        const hashingAlgorithmProps: HashingAlgorithmPropsCreate = {
            name: passwordProvider.method,
        };

        const hashingAlgorithm = await HashingAlgorithm.create({
            idProvider,
            props: hashingAlgorithmProps,
        });

        const userProps: UserPropsCreate = {
            name: "Teste 02",
            email: "teste02@.com",
            hashingAlgorithm,
            verificationTokens: [],
            urls: [],
            password: "87654321",
        };

        const userResult = await User.create({
            props: userProps,
            idProvider: idProvider,
            passwordProviderConfig: {
                provider: passwordProvider,
                salt: await passwordProvider.salt(),
            },
            validator: userValidator,
        });

        expect(userResult.isError()).toBeTruthy();
        expect(userResult.value).toEqual([
            {
                path: "email",
                message: "Email informado é inválido",
            },
        ]);
    });
});
