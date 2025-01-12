export interface ValidationError<T> {
    path: keyof T;
    message: string;
}

export interface Validator<T> {
    validate(props: T): ValidationError<T>[];
}
