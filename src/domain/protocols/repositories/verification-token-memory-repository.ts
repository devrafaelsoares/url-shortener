export interface VerificationTokenMemoryRepository {
    canSendToken(verificationTokenBlocked: string): Promise<boolean>;
    addTemporaryHold(blockKey: string, value: string, blockDuration: number): Promise<void>;
    getWaitingTime(verificationTokenBlocked: string): Promise<number>;
}
