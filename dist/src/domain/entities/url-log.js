"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlLog = void 0;
const helpers_1 = require("../../helpers");
class UrlLog {
    constructor(props, providers, id) {
        var _a, _b, _c;
        this._id = providers ? providers.idProvider.generate() : id;
        const currentDate = new Date();
        const gmt = -3 * 60 * 60 * 1000;
        const date = new Date(currentDate.getTime() + gmt);
        this.props = Object.assign(Object.assign({}, props), { userAgent: (_a = props.userAgent) !== null && _a !== void 0 ? _a : "", createdAt: (_b = props.createdAt) !== null && _b !== void 0 ? _b : date, updatedAt: (_c = props.createdAt) !== null && _c !== void 0 ? _c : date });
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
            const { idProvider } = providers;
            return (0, helpers_1.success)(new UrlLog(props, { idProvider }, id));
        }
        return (0, helpers_1.success)(new UrlLog(props, undefined, id));
    }
    get id() {
        return this._id;
    }
    get ipAddress() {
        return this.props.ipAddress;
    }
    set ipAddress(ipAddress) {
        this.props.ipAddress = ipAddress;
    }
    get userAgent() {
        return this.props.userAgent;
    }
    set userAgent(userAgent) {
        this.props.userAgent = userAgent;
    }
    get accessedAt() {
        return this.props.accessedAt;
    }
    set accessedAt(accessedAt) {
        this.props.accessedAt = accessedAt;
    }
    get urlId() {
        return this.props.urlId;
    }
    get url() {
        return this.props.url;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
}
exports.UrlLog = UrlLog;
