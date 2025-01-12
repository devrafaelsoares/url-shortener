export interface UserMemoryRepository {
    userHasAccountBlocked(userAccountBlockedId: string): Promise<boolean>;
    addNewAttemptFails(attemptsKey: string): Promise<number>;
    addAttemptLock(attemptsKey: string, blockDuration: number): Promise<void>;
    addTemporaryBlock(blockKey: string, value: string, blockDuration: number): Promise<void>;
    removeAttemptLock(attemptsKey: string): Promise<void>;
}
