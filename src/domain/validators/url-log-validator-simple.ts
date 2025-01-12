import { UrlLogPropsCreate } from "@domain/entities";
import { ValidationError, Validator } from "@domain/protocols/validators";

export class UrlLogValidatorSimple implements Validator<UrlLogPropsCreate> {
    private errors: ValidationError<UrlLogPropsCreate>[] = [];

    validate(props: UrlLogPropsCreate): ValidationError<UrlLogPropsCreate>[] {
        this.cleanErrors();

        this.validateIpAddress(props.ipAddress);
        this.validateUserAgent(props.userAgent!);
        this.validateAccessedAt(props.accessedAt);

        return this.errors;
    }

    private static isEmpty(value: string): boolean {
        const valueSanatize = value.trim();
        return valueSanatize.length === 0;
    }

    private isIpValid(value: string): boolean {
        const ipv4Regex =
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex =
            /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}(([0-9a-fA-F]{1,4}:){1,4}|([0-9]{1,3}\.){3}[0-9]{1,3})|([0-9a-fA-F]{1,4}:){1,4}:([0-9]{1,3}\.){3}[0-9]{1,3})$/i;

        return ipv4Regex.test(value) || ipv6Regex.test(value);
    }

    private isAccessedAt(value: Date): boolean {
        const currentDate = new Date();

        return value.getTime() <= currentDate.getTime();
    }

    private validateIpAddress(value: string): void {
        const rules = [
            {
                validate: (val: string) => UrlLogValidatorSimple.isEmpty(val),
                message: "Endereço ip é obrigatório",
            },

            { validate: (val: string) => !this.isIpValid(val), message: "Endereço ip informado é inválido" },
        ];

        for (const rule of rules) {
            if (rule.validate(value)) {
                this.errors.push({ path: "ipAddress", message: rule.message });
                break;
            }
        }
    }

    private validateUserAgent(value: string): void {
        const rules = [
            {
                validate: (val: string) => UrlLogValidatorSimple.isEmpty(val),
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

    private validateAccessedAt(value: Date): void {
        const rules = [
            {
                validate: (val: Date) => !this.isAccessedAt(val),
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

    cleanErrors(): void {
        this.errors = [];
    }
}
