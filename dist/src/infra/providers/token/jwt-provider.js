"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtToken {
    constructor(props) {
        this.props = props;
        this._value = null;
        this._expiresAt = null;
        if (this.props.token) {
            this._value = this.props.token;
            const decoded = jsonwebtoken_1.default.verify(this.props.token, this.props.secret);
            this._expiresAt = new Date(decoded.exp * 1000);
        }
    }
    generate() {
        if (!this.props.expirationTime) {
            throw new Error("O tempo de expiração deve ser fornecido ao gerar um novo token.");
        }
        this._value = jsonwebtoken_1.default.sign(this.props.payload || {}, this.props.secret, {
            expiresIn: this.props.expirationTime,
        });
        this._expiresAt = new Date(Date.now() + this.getExpirationInMilliseconds(this.props.expirationTime));
        return { token: this._value, expiresAt: this._expiresAt };
    }
    get value() {
        return this._value;
    }
    get expiresAt() {
        return this._expiresAt;
    }
    validate() {
        try {
            if (!this._value)
                return false;
            const decoded = jsonwebtoken_1.default.verify(this._value, this.props.secret);
            const exp = decoded.exp ? new Date(decoded.exp * 1000) : null;
            return !!exp && exp > new Date();
        }
        catch (err) {
            return false;
        }
    }
    get payload() {
        try {
            if (!this._value)
                return null;
            const decoded = jsonwebtoken_1.default.verify(this._value, this.props.secret);
            return decoded;
        }
        catch (err) {
            return null;
        }
    }
    getExpirationInMilliseconds(expirationTime) {
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
exports.JwtToken = JwtToken;
