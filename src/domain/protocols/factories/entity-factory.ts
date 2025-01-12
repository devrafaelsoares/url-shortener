import { ValidationError } from "@domain/protocols/validators";

export interface EntityFactory<T, K> {
    createProps(overrides: Partial<K>): K;
    createEntity(overrides: Partial<K>): T | ValidationError<T>[];
}
