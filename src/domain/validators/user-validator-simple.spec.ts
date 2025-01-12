import { User, UserPropsCreate } from "@domain/entities";
import { UserValidatorSimple } from "./user-validator-simple";
import { IdProvider, PasswordProvider } from "@domain/protocols/providers";
import { BcryptPasswordProvider } from "@infra/providers/password";
import { Cuid2IdProvider } from "@infra/providers/id";
import { HashingAlgorithm, HashingAlgorithmPropsCreate } from "@domain/entities";
import { JwtToken } from "@infra/providers/token";
import env from "@env";

describe("UserValidatorSimple", () => {
    let userValidatorSimple: UserValidatorSimple;
    let passwordProvider: PasswordProvider;
    let idProvider: IdProvider;
    let confirmationEmailTokenProvider;

    beforeEach(() => {
        userValidatorSimple = new UserValidatorSimple();
        passwordProvider = new BcryptPasswordProvider();
        idProvider = new Cuid2IdProvider();
        confirmationEmailTokenProvider = new JwtToken({
            expirationTime: "1h",
            secret: env.SECRET_KEY_TOKEN,
        });
    });

    it("should return an error if name is empty", async () => {
        const hashingAlgorithmProps: HashingAlgorithmPropsCreate = {
            name: passwordProvider.method,
        };

        const hashingAlgorithm = await HashingAlgorithm.create({
            idProvider,
            props: hashingAlgorithmProps,
        });

        const userProps: UserPropsCreate = {
            name: "",
            email: "teste01@email.com",
            verificationTokens: [],
            urls: [],
            hashingAlgorithm,
            password: "12345678",
        };

        const userResult = await User.create({
            props: userProps,
            idProvider,
            passwordProviderConfig: { provider: passwordProvider },
            validator: userValidatorSimple,
        });

        expect(userResult.value).toEqual([
            {
                path: "name",
                message: "O nome é obrigatório",
            },
        ]);
    });

    it("should return an error if email is invalid", async () => {
        const hashingAlgorithmProps: HashingAlgorithmPropsCreate = {
            name: passwordProvider.method,
        };

        const hashingAlgorithm = await HashingAlgorithm.create({
            idProvider,
            props: hashingAlgorithmProps,
        });

        const userProps: UserPropsCreate = {
            name: "Teste 02",
            email: "teste02email.com",
            verificationTokens: [],
            urls: [],
            hashingAlgorithm,
            password: "12345678",
        };

        const userResult = await User.create({
            props: userProps,
            idProvider,
            passwordProviderConfig: { provider: passwordProvider },
            validator: userValidatorSimple,
        });

        expect(userResult.value).toEqual([
            {
                path: "email",
                message: "Email informado é inválido",
            },
        ]);
    });

    it("should return an error if the password is less than eight characters long", async () => {
        const hashingAlgorithmProps: HashingAlgorithmPropsCreate = {
            name: passwordProvider.method,
        };

        const hashingAlgorithm = await HashingAlgorithm.create({
            idProvider,
            props: hashingAlgorithmProps,
        });

        const userProps: UserPropsCreate = {
            name: "Teste 03",
            email: "teste03@email.com",
            verificationTokens: [],
            urls: [],
            hashingAlgorithm,
            password: "1234567",
        };

        const userResult = await User.create({
            props: userProps,
            idProvider,
            passwordProviderConfig: { provider: passwordProvider },
            validator: userValidatorSimple,
        });

        expect(userResult.value).toEqual([
            {
                path: "password",
                message: "A senha deve ter no mínimo oito caracteres",
            },
        ]);
    });
});
