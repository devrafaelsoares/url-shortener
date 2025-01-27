import { HttpResponse } from "./http";

export type Middleware<T = any> = {
    handle(request: T): Promise<HttpResponse | void>;
};
