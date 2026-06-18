import jwt from "jsonwebtoken";
import { TokenProvider, JwtAuthProvider, JwtTokenType } from "@domain/protocols/providers";
import { TimeUtils } from "@/helpers";

// =============================================================================
// JwtToken — Provider simétrico (HMAC/HS256)
// Usado para verification tokens (confirmação de e-mail, reset de senha)
// =============================================================================

type JwtTokenProps<T extends Record<string, unknown>> = {
    readonly secret: string;
    readonly token?: string;
    readonly expirationTime?: string;
    readonly payload?: T;
};

export class JwtToken<T extends Record<string, unknown>> implements TokenProvider {
    private _value: string | null = null;
    private _expiresAt: Date | null = null;

    constructor(private props: JwtTokenProps<T>) {
        if (this.props.token) {
            this._value = this.props.token;
            try {
                const decoded = jwt.verify(this.props.token, this.props.secret) as jwt.JwtPayload;
                this._expiresAt = new Date(decoded.exp! * 1000);
            } catch {
                this._value = null;
                this._expiresAt = null;
            }
        }
    }

    generate(): { token: string; expiresAt: Date } {
        if (!this.props.expirationTime) {
            throw new Error("O tempo de expiração deve ser fornecido ao gerar um novo token.");
        }

        const durationInMs = this.getExpirationInMilliseconds(this.props.expirationTime);
        const durationInSeconds = Math.floor(durationInMs / 1000);

        this._value = jwt.sign(this.props.payload || {}, this.props.secret, {
            expiresIn: durationInSeconds,
        });
        this._expiresAt = new Date(Date.now() + durationInMs);

        return { token: this._value, expiresAt: this._expiresAt };
    }

    get value(): string | null {
        return this._value;
    }

    set value(token: string) {
        this._value = token;
    }

    get expiresAt(): Date | null {
        return this._expiresAt;
    }

    set expiresAt(expirationDate: Date) {
        this._expiresAt = expirationDate;
    }

    validate(): boolean {
        try {
            if (!this._value) return false;
            const decoded = jwt.verify(this._value, this.props.secret) as jwt.JwtPayload;
            const exp = decoded.exp ? new Date(decoded.exp * 1000) : null;
            return !!exp && exp > new Date();
        } catch {
            return false;
        }
    }

    get payload(): T | null {
        try {
            if (!this._value) return null;
            const decoded = jwt.verify(this._value, this.props.secret) as jwt.JwtPayload;
            return decoded as T;
        } catch {
            return null;
        }
    }

    private getExpirationInMilliseconds(expirationTime: string): number {
        const durationInSeconds = TimeUtils.parseDuration(expirationTime);
        if (durationInSeconds !== null) {
            return durationInSeconds * 1000;
        }

        const time = parseInt(expirationTime.slice(0, -1), 10);
        const unit = expirationTime.slice(-1);

        switch (unit) {
            case "h":
                return time * 60 * 60 * 1000;
            case "m":
                return time * 60 * 1000;
            case "d":
                return time * 24 * 60 * 60 * 1000;
            default:
                return 0;
        }
    }
}

// =============================================================================
// JwtAsymmetricAuthProvider — Provider assimétrico (ES256/ECDSA P-256)
// Usado para Access Tokens e Refresh Tokens
// Chave privada assina, chave pública verifica
// =============================================================================

type JwtAsymmetricKeyPair = {
    readonly privateKey: string;
    readonly publicKey: string;
    readonly expirationTime: string;
};

type JwtAsymmetricAuthProviderProps = {
    readonly access: JwtAsymmetricKeyPair;
    readonly refresh: JwtAsymmetricKeyPair;
};

export class JwtAsymmetricAuthProvider implements JwtAuthProvider {
    constructor(private readonly props: JwtAsymmetricAuthProviderProps) {}

    sign(payload: Record<string, unknown>, type: JwtTokenType): { token: string; expiresAt: Date } {
        const keyPair = type === "access" ? this.props.access : this.props.refresh;

        const durationInSeconds = TimeUtils.parseDuration(keyPair.expirationTime);
        if (!durationInSeconds) {
            throw new Error(`Formato de expiração inválido: ${keyPair.expirationTime}`);
        }

        const tokenPayload = { ...payload, type };

        const token = jwt.sign(tokenPayload, keyPair.privateKey, {
            algorithm: "ES256",
            expiresIn: durationInSeconds,
        });

        const expiresAt = new Date(Date.now() + durationInSeconds * 1000);

        return { token, expiresAt };
    }

    verify<T = Record<string, unknown>>(token: string, expectedType: JwtTokenType): T | null {
        const keyPair = expectedType === "access" ? this.props.access : this.props.refresh;
        
        try {
            const decoded = jwt.verify(token, keyPair.publicKey, {
                algorithms: ["ES256"], // AppSec: Previne ataques de confusão de algoritmo
            }) as jwt.JwtPayload;

            if (decoded.type !== expectedType) {
                return null;
            }

            return decoded as T;
        } catch {
            return null;
        }
    }
}
