"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationToken = exports.VerificationTokenTypes = void 0;
const user_1 = require("./user");
var VerificationTokenTypes;
(function (VerificationTokenTypes) {
    VerificationTokenTypes["CONFIRMATION_EMAIL"] = "CONFIRMATION_EMAIL";
    VerificationTokenTypes["PASSWORD_RECOVERY"] = "PASSWORD_RECOVERY";
})(VerificationTokenTypes || (exports.VerificationTokenTypes = VerificationTokenTypes = {}));
class VerificationToken {
    constructor(props, providers, id) {
        var _a, _b;
        this._id = id || providers.idProvider.generate();
        const date = user_1.User.getCurrentDateWithGmt();
        this.props = Object.assign(Object.assign({}, props), { createdAt: (_a = props.createdAt) !== null && _a !== void 0 ? _a : date, updatedAt: (_b = props.updatedAt) !== null && _b !== void 0 ? _b : date });
    }
    static create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { props, idProvider, tokenProvider, id } = params;
            return new VerificationToken(props, { idProvider, tokenProvider }, id);
        });
    }
    get id() {
        return this._id;
    }
    get token() {
        return this.props.token;
    }
    get type() {
        return this.props.type;
    }
    get expiresAt() {
        return this.props.expiresAt;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    isExpired() {
        return new Date() > this.props.expiresAt;
    }
}
exports.VerificationToken = VerificationToken;
