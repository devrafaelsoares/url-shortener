import { CookieSerializeOptions } from "@fastify/cookie";

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    REDIRECT = 301,
    NOT_FOUND = 404,
    NO_CONTENT = 204,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
    CONFLIT = 409,
    GONE = 410,
    TO_MANY_REQUESTS = 429,
}

type Headers = {
    [header: string]: string;
};

type Cookie = {
    name: string;
    value: string;
    options?: CookieSerializeOptions;
};

export type HttpResponse<T = any> = {
    success: boolean;
    moment: Date;
    status_code: HttpStatus;
    data: T;
    headers?: Headers;
    cookies?: Cookie[];
};
