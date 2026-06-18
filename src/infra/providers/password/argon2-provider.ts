import { PasswordProvider } from "@domain/protocols/providers";
import argon2 from "argon2";
import crypto from "crypto";
import env from "@env";

export class Argon2PasswordProvider implements PasswordProvider {
    private _method = "ARGON2";

    get method(): string {
        return this._method;
    }

    
    private getArgonOptions(): argon2.Options & { secret?: Buffer } {
        const options: argon2.Options & { secret?: Buffer } = {
            type: argon2.argon2id,
            memoryCost: env.ARGON2_MEMORY_COST, 
            timeCost: env.ARGON2_TIME_COST, 
            parallelism: env.ARGON2_PARALLELISM, 
            hashLength: 32 
        };

        
        if (env.ARGON2_SECRET) {
            options.secret = Buffer.from(env.ARGON2_SECRET);
        }

        return options;
    }

    async hash(password: string): Promise<string> {
        return argon2.hash(password, this.getArgonOptions());
    }

    async verify(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await argon2.verify(hashedPassword, password, this.getArgonOptions());
        } catch {
            return false;
        }
    }

    async salt(): Promise<string> {
        
        
        
        
        return crypto.randomBytes(32).toString("hex");
    }
}
