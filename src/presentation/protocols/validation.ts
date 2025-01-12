import { Either } from "@/helpers";

export type ErrosValidator = { path: string | number; message: string }[];

export interface Validator<T> {
    validate(data: T): Either<Error | ErrosValidator, T>;
}
