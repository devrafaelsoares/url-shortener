"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlLogValidatorSimple = void 0;
class UrlLogValidatorSimple {
    constructor() {
        this.errors = [];
    }
    validate(props) {
        this.cleanErrors();
        this.validateIpAddress(props.ipAddress);
        this.validateUserAgent(props.userAgent);
        this.validateAccessedAt(props.accessedAt);
        return this.errors;
    }
    static isEmpty(value) {
        const valueSanatize = value.trim();
        return valueSanatize.length === 0;
    }
    isIpValid(value) {
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}(([0-9a-fA-F]{1,4}:){1,4}|([0-9]{1,3}\.){3}[0-9]{1,3})|([0-9a-fA-F]{1,4}:){1,4}:([0-9]{1,3}\.){3}[0-9]{1,3})$/i;
        return ipv4Regex.test(value) || ipv6Regex.test(value);
    }
    isAccessedAt(value) {
        const currentDate = new Date();
        return value.getTime() <= currentDate.getTime();
    }
    validateIpAddress(value) {
        const rules = [
            {
                validate: (val) => UrlLogValidatorSimple.isEmpty(val),
                message: "Endereço ip é obrigatório",
            },
            { validate: (val) => !this.isIpValid(val), message: "Endereço ip informado é inválido" },
        ];
        for (const rule of rules) {
            if (rule.validate(value)) {
                this.errors.push({ path: "ipAddress", message: rule.message });
                break;
            }
        }
    }
    validateUserAgent(value) {
        const rules = [
            {
                validate: (val) => UrlLogValidatorSimple.isEmpty(val),
                message: "O agente de usuário é obrigatório",
            },
        ];
        for (const rule of rules) {
            if (rule.validate(value)) {
                this.errors.push({ path: "userAgent", message: rule.message });
                break;
            }
        }
    }
    validateAccessedAt(value) {
        const rules = [
            {
                validate: (val) => !this.isAccessedAt(val),
                message: "Data de acesso é inválida",
            },
        ];
        for (const rule of rules) {
            if (rule.validate(value)) {
                this.errors.push({ path: "accessedAt", message: rule.message });
                break;
            }
        }
    }
    cleanErrors() {
        this.errors = [];
    }
}
exports.UrlLogValidatorSimple = UrlLogValidatorSimple;
