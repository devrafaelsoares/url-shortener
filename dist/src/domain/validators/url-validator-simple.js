"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlValidatorSimple = void 0;
class UrlValidatorSimple {
    constructor() {
        this.errors = [];
    }
    validate(props) {
        this.cleanErrors();
        this.validateOriginalUrl(props.originalUrl);
        return this.errors;
    }
    static isEmpty(value) {
        const valueSanatize = value.trim();
        return valueSanatize.length === 0;
    }
    isUrlValid(value) {
        return new RegExp(/^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/gi).test(value);
    }
    validateOriginalUrl(value) {
        const rules = [
            {
                validate: (val) => UrlValidatorSimple.isEmpty(val),
                message: "A url original é obrigatório",
            },
            { validate: (val) => !this.isUrlValid(val), message: "URL informada é inválida" },
        ];
        for (const rule of rules) {
            if (rule.validate(value)) {
                this.errors.push({ path: "originalUrl", message: rule.message });
                break;
            }
        }
    }
    cleanErrors() {
        this.errors = [];
    }
}
exports.UrlValidatorSimple = UrlValidatorSimple;
