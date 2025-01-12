export interface EntityRepository<T, P> {
    save(data: T): Promise<number | void>;
    create(data: T): Promise<T>;
    findById(id: string): Promise<T | null>;
    find<K extends keyof P>(field: K, value: P[K]): Promise<T[] | null>;
    findAll(): Promise<T[]>;
    delete(id: string): Promise<void>;
}
