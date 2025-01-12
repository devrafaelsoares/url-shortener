import { IdProvider } from "@domain/protocols/providers";
import { createId } from "@paralleldrive/cuid2";

export class Cuid2IdProvider implements IdProvider {
    generate(): string {
        return createId();
    }
}
