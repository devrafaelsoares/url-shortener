import { UrlLog, UrlLogPropsCreate } from "@domain/entities";
import { UrlLogValidatorSimple } from "@domain/validators";
import { ValidationError } from "@domain/protocols/validators";
import { Cuid2IdProvider } from "@infra/providers/id";

export class UrlLogFactory {
    createProps(overrides: Partial<UrlLogPropsCreate> = {}): UrlLogPropsCreate {
        return {
            ipAddress: "",
            accessedAt: new Date(),
            urlId: "",
            ...overrides,
        };
    }

    createEntity(overrides: Partial<UrlLogPropsCreate> = {}): ValidationError<UrlLogPropsCreate>[] | UrlLog {
        const urlProps = this.createProps({ ...overrides });

        const urlValidatorSimple = new UrlLogValidatorSimple();
        const url = UrlLog.create({
            props: urlProps,
            providers: {
                idProvider: new Cuid2IdProvider(),
            },
            validator: urlValidatorSimple,
        });
        return url.value;
    }
}
