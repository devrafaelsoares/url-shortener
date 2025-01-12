import { PasswordProvider } from "@domain/protocols/providers";
import bcrypt from "bcrypt";

export class BcryptPasswordProvider implements PasswordProvider {
    private _method = "BLOWFISH";

    get method(): string {
        return this._method;
    }

    async hash(password: string, salt = 10): Promise<string> {
        return bcrypt.hash(password, salt);
    }
    async verify(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
    async salt(): Promise<string> {
        return await bcrypt.genSalt(10);
    }
}
