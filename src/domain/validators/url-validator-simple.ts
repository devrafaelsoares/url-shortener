import { UrlPropsCreate } from "@domain/entities";
import { ValidationError, Validator } from "@domain/protocols/validators";

export class UrlValidatorSimple implements Validator<UrlPropsCreate> {
    private errors: ValidationError<UrlPropsCreate>[] = [];

    validate(props: UrlPropsCreate): ValidationError<UrlPropsCreate>[] {
        this.cleanErrors();

        this.validateOriginalUrl(props.originalUrl);

        return this.errors;
    }

    private static isEmpty(value: string): boolean {
        const valueSanatize = value.trim();
        return valueSanatize.length === 0;
    }

    private isUrlValid(value: string): boolean {
        return new RegExp(/^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/gi).test(value);
    }

    private validateOriginalUrl(value: string): void {
        const rules = [
            {
                validate: (val: string) => UrlValidatorSimple.isEmpty(val),
                message: "A url original é obrigatório",
            },

            { validate: (val: string) => !this.isUrlValid(val), message: "URL informada é inválida" },
        ];

        for (const rule of rules) {
            if (rule.validate(value)) {
                this.errors.push({ path: "originalUrl", message: rule.message });
                break;
            }
        }
    }

    cleanErrors(): void {
        this.errors = [];
    }
}
