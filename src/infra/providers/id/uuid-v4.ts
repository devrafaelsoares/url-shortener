import { IdProvider } from "@domain/protocols/providers";
import { v4 as uuidv4 } from "uuid";

export class UuidV4IdProvider implements IdProvider {
    generate(): string {
        return uuidv4();
    }
}
