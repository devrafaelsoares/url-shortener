export interface Paginate<T> {
    items: T[];
    total: number;
    limit: number;
    page: number;
    pages: number;
}
