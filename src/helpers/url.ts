import { env } from "process";
import { MY_IP_ADDRESS } from "./network";

type Protocol = "http" | "https";

export class UrlBuilder {
    private readonly protocol: Protocol;
    private readonly host: string;
    private readonly port: number | string;

    constructor(protocol: Protocol = "https", host: string, port?: number | string) {
        this.protocol = protocol;
        this.host = host;
        this.port = port || (this.protocol === "http" ? 80 : 443);
    }

    buildUrl(paths: string[], params?: Record<string, string>): string {
        const path = paths.join("/");
        const url = new URL(`${this.protocol}://${this.host}:${this.port}/${path}`);

        if (params) {
            Object.keys(params).forEach(key => {
                url.searchParams.append(key, params[key]);
            });
        }

        return url.toString();
    }

    buildUserEmailConfirmationUrl(id: string, token: string): string {
        return this.buildUrl(["confirmation", "account", "id", id], { token });
    }

    buildUserRecoverPasswordUrl(id: string, token: string): string {
        return this.buildUrl(["recover", "password", "id", id], { token });
    }
}

export const createServerUrlBuilderDevelopment = (): UrlBuilder => {
    return new UrlBuilder("http", MY_IP_ADDRESS, env.FASTIFY_PORT);
};

export const createFrontUrlBuilderDevelopment = (): UrlBuilder => {
    return new UrlBuilder("http", MY_IP_ADDRESS, 3000);
};

export const createUrlBuilderProduction = (): UrlBuilder => {
    return new UrlBuilder("https", "");
};
