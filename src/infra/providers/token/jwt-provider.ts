import jwt from "jsonwebtoken";
import { TokenProvider } from "@domain/protocols/providers";

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
            const decoded = jwt.verify(this.props.token, this.props.secret) as jwt.JwtPayload;
            this._expiresAt = new Date(decoded.exp! * 1000);
        }
    }

    generate(): { token: string; expiresAt: Date } {
        if (!this.props.expirationTime) {
            throw new Error("O tempo de expiração deve ser fornecido ao gerar um novo token.");
        }
        this._value = jwt.sign(this.props.payload || {}, this.props.secret, {
            expiresIn: parseInt(this.props.expirationTime),
        });
        this._expiresAt = new Date(Date.now() + this.getExpirationInMilliseconds(this.props.expirationTime));

        return { token: this._value, expiresAt: this._expiresAt };
    }

    get value(): string | null {
        return this._value;
    }

    get expiresAt(): Date | null {
        return this._expiresAt;
    }

    validate(): boolean {
        try {
            if (!this._value) return false;

            const decoded = jwt.verify(this._value, this.props.secret) as jwt.JwtPayload;
            const exp = decoded.exp ? new Date(decoded.exp * 1000) : null;
            return !!exp && exp > new Date();
        } catch (err) {
            return false;
        }
    }

    get payload(): T | null {
        try {
            if (!this._value) return null;

            const decoded = jwt.verify(this._value, this.props.secret) as jwt.JwtPayload;
            return decoded as T;
        } catch (err) {
            return null;
        }
    }

    private getExpirationInMilliseconds(expirationTime: string): number {
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
