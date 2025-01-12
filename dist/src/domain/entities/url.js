"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = void 0;
const helpers_1 = require("../../helpers");
class Url {
    constructor(props, providers, id) {
        var _a, _b, _c, _d, _e, _f;
        this._id = providers ? providers.idProvider.generate() : id;
        const currentDate = new Date();
        const gmt = -3 * 60 * 60 * 1000;
        const date = new Date(currentDate.getTime() + gmt);
        this.props = Object.assign(Object.assign({}, props), { userId: (_a = props.userId) !== null && _a !== void 0 ? _a : null, shortUrl: (_b = props.shortUrl) !== null && _b !== void 0 ? _b : providers.urlShortenerProvider.shorten(), expiresAt: (_c = props.expiresAt) !== null && _c !== void 0 ? _c : null, hitCount: (_d = props.hitCount) !== null && _d !== void 0 ? _d : 0, createdAt: (_e = props.createdAt) !== null && _e !== void 0 ? _e : date, updatedAt: (_f = props.createdAt) !== null && _f !== void 0 ? _f : date });
    }
    static create(params) {
        const { props, providers, validator, id } = params;
        if (validator) {
            const validationErrors = validator.validate(props);
            if (validationErrors.length > 0) {
                return (0, helpers_1.error)(validationErrors);
            }
        }
        if (providers) {
            const { idProvider, urlShortenerProvider } = providers;
            return (0, helpers_1.success)(new Url(props, { idProvider, urlShortenerProvider }, id));
        }
        return (0, helpers_1.success)(new Url(props, undefined, id));
    }
    get id() {
        return this._id;
    }
    get shortUrl() {
        return this.props.shortUrl;
    }
    set shortUrl(shortUrl) {
        this.props.shortUrl = shortUrl;
    }
    get originalUrl() {
        return this.props.originalUrl;
    }
    set originalUrl(originalUrl) {
        this.props.originalUrl = originalUrl;
    }
    get hitCount() {
        return this.props.hitCount;
    }
    set hitCount(hitCount) {
        this.props.hitCount = hitCount;
    }
    set expiresAt(expiresAt) {
        this.props.expiresAt = expiresAt;
    }
    get expiresAt() {
        return this.props.expiresAt;
    }
    set userId(userId) {
        this.props.userId = userId;
    }
    get userId() {
        return this.props.userId;
    }
    set user(user) {
        this.props.user = user;
    }
    get user() {
        return this.props.user;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
}
exports.Url = Url;
