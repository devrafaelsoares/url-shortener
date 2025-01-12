import { HttpResponse } from "./http";

export type Controller<T = any, K = any> = {
    handle(request: T, reply: K): Promise<HttpResponse | void>;
};
