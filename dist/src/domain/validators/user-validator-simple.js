"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidatorSimple = void 0;
class UserValidatorSimple {
    constructor() {
        this.errors = [];
    }
    validate(props) {
        this.cleanErrors();
        this.validateName(props.name);
        this.validateEmail(props.email);
        this.validatePassword(props.password);
        return this.errors;
    }
    static isEmpty(value) {
        const valueSanatize = value.trim();
        return valueSanatize.length === 0;
    }
    static isEmail(value) {
        return new RegExp(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/gi).test(value);
    }
    validateName(value) {
        const rules = [
            {
                validate: (val) => UserValidatorSimple.isEmpty(val),
                message: "O nome é obrigatório",
            },
            {
                validate: (val) => val.length > 255,
                message: "O nome deve ter no máximo 255 caracteres",
            },
        ];
        for (const rule of rules) {
            if (rule.validate(value)) {
                this.errors.push({ path: "name", message: rule.message });
                break;
            }
        }
    }
    validatePassword(value) {
        const rules = [
            {
                validate: (val) => val.length < 8,
                message: "A senha deve ter no mínimo oito caracteres",
            },
        ];
        for (const rule of rules) {
            if (rule.validate(value)) {
                this.errors.push({
                    path: "password",
                    message: rule.message,
                });
                break;
            }
        }
    }
    validateEmail(value) {
        const rules = [
            {
                validate: (val) => !UserValidatorSimple.isEmail(val),
                message: "Email informado é inválido",
            },
        ];
        for (const rule of rules) {
            if (rule.validate(value)) {
                this.errors.push({
                    path: "email",
                    message: rule.message,
                });
                break;
            }
        }
    }
    cleanErrors() {
        this.errors = [];
    }
}
exports.UserValidatorSimple = UserValidatorSimple;
