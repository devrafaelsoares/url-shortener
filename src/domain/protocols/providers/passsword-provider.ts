export interface PasswordProvider {
    hash(password: string, salt?: string | number): Promise<string>;
    verify(password: string, hashedPassword: string): Promise<boolean>;
    salt(): Promise<string>;
    get method(): string;
}

export type PasswordProviderConfig = {
    provider: PasswordProvider;
    salt?: string;
};
