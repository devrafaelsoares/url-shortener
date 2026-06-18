export interface TokenProvider<T = Record<string, unknown>> {
    get value(): string | null;
    set value(token: string);
    get payload(): T | null;
    get expiresAt(): Date | null;
    set expiresAt(expirationDate: Date);
    generate(payload?: T): { token: string; expiresAt: Date };
    validate(): boolean;
}

export type TokenProviderConfig = {
    emailConfirmationTokenProvider: TokenProvider;
    passwordResetTokenProvider: TokenProvider;
};

export type JwtTokenType = "access" | "refresh";

export interface JwtAuthProvider {
    sign(payload: Record<string, unknown>, type: JwtTokenType): { token: string; expiresAt: Date };
    verify<T = Record<string, unknown>>(token: string, expectedType: JwtTokenType): T | null;
}
