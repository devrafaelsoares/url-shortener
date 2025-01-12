export type UrlResponseProps = {
    id: string;
    original_url: string;
    short_url: string;
    hit_count: number;
    expires_at: Date | null;
    created_at: Date;
};

export type PaginatedUrlResponseProps = {
    urls: UrlResponseProps[];
    total: number;
    limit: number;
    page: number;
    pages: number;
};

export type CreateUrlRequestProps = {
    original_url: string;
};

export type CreateUrlRequestUseCaseProps = {
    original_url: string;
    token?: string;
};

export type FindOriginalUrlRequestProps = {
    short_url: string;
};

export type FindAllUrlsByUserRequestProps = {
    page: number;
    limit: number;
    user_id: string;
};

export type FindAllUrlsByUserParamsProps = {
    user_id: string;
};

export type FindAllUrlsByUserQueryProps = {
    page: number;
    limit: number;
};

export type FindShortUrlRequestProps = {
    id: string;
};

export type FindOriginalUrlUseCaseRequestProps = {
    ip_address: string;
    user_agent?: string;
    short_url: string;
};
