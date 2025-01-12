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
exports.User = void 0;
const helpers_1 = require("../../helpers");
class User {
    constructor(props, providers, id) {
        var _a, _b, _c;
        this._id = id || providers.idProvider.generate();
        const date = User.getCurrentDateWithGmt();
        this.props = Object.assign(Object.assign({}, props), { urls: props.urls || [], verificationTokens: props.verificationTokens || [], isActive: (_a = props.isActive) !== null && _a !== void 0 ? _a : false, hashSalt: props.hashSalt || "", createdAt: (_b = props.createdAt) !== null && _b !== void 0 ? _b : date, updatedAt: (_c = props.updatedAt) !== null && _c !== void 0 ? _c : date });
    }
    static create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { props, idProvider, passwordProviderConfig, validator, id } = params;
            if (validator) {
                const validationErrors = validator.validate(props);
                if (validationErrors.length > 0)
                    return (0, helpers_1.error)(validationErrors);
            }
            if (passwordProviderConfig) {
                props.password = yield passwordProviderConfig.provider.hash(props.password, passwordProviderConfig.salt);
                props.hashSalt = passwordProviderConfig.salt;
            }
            return (0, helpers_1.success)(new User(props, { idProvider }, id));
        });
    }
    static getCurrentDateWithGmt() {
        const currentDate = new Date();
        const gmtOffset = -3 * 60 * 60 * 1000;
        return new Date(currentDate.getTime() + gmtOffset);
    }
    get id() {
        return this._id;
    }
    get name() {
        return this.props.name;
    }
    get email() {
        return this.props.email;
    }
    get password() {
        return this.props.password;
    }
    get isActive() {
        return this.props.isActive;
    }
    get hashingAlgorithm() {
        return this.props.hashingAlgorithm;
    }
    get verificationTokens() {
        return this.props.verificationTokens;
    }
    get urls() {
        return this.props.urls;
    }
    get hashSalt() {
        return this.props.hashSalt;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    setPassword(newPassword, passwordProviderConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield passwordProviderConfig.provider.hash(newPassword, passwordProviderConfig.salt);
            this.props.password = hashedPassword;
            this.props.hashSalt = passwordProviderConfig.salt || "";
            this.props.updatedAt = User.getCurrentDateWithGmt();
        });
    }
    activate() {
        this.props.isActive = true;
    }
    addVerificationToken(token) {
        this.props.verificationTokens.push(token);
    }
    removeLastVerificationToken() {
        return this.props.verificationTokens.pop();
    }
    addUrl(url) {
        this.props.urls.push(url);
    }
}
exports.User = User;
