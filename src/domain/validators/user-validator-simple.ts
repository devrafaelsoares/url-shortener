import { UserPropsCreate } from "@domain/entities";
import { ValidationError, Validator } from "@domain/protocols/validators";

export class UserValidatorSimple implements Validator<UserPropsCreate> {
    private errors: ValidationError<UserPropsCreate>[] = [];

    validate(props: UserPropsCreate): ValidationError<UserPropsCreate>[] {
        this.cleanErrors();

        this.validateName(props.name);
        this.validateEmail(props.email);
        this.validatePassword(props.password);

        return this.errors;
    }

    private static isEmpty(value: string): boolean {
        const valueSanatize = value.trim();
        return valueSanatize.length === 0;
    }

    private static isEmail(value: string): boolean {
        return new RegExp(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/gi).test(
            value
        );
    }

    private validateName(value: string): void {
        const rules = [
            {
                validate: (val: string) => UserValidatorSimple.isEmpty(val),
                message: "O nome é obrigatório",
            },

            {
                validate: (val: string) => val.length > 255,
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

    private validatePassword(value: string): void {
        const rules = [
            {
                validate: (val: string) => val.length < 8,
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

    private validateEmail(value: string): void {
        const rules = [
            {
                validate: (val: string) => !UserValidatorSimple.isEmail(val),
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

    cleanErrors(): void {
        this.errors = [];
    }
}
