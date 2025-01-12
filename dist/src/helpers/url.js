"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrlBuilderProduction = exports.createFrontUrlBuilderDevelopment = exports.createServerUrlBuilderDevelopment = exports.UrlBuilder = void 0;
const process_1 = require("process");
const network_1 = require("./network");
class UrlBuilder {
    constructor(protocol = "https", host, port) {
        this.protocol = protocol;
        this.host = host;
        this.port = port || (this.protocol === "http" ? 80 : 443);
    }
    buildUrl(paths, params) {
        const path = paths.join("/");
        const url = new URL(`${this.protocol}://${this.host}:${this.port}/${path}`);
        if (params) {
            Object.keys(params).forEach(key => {
                url.searchParams.append(key, params[key]);
            });
        }
        return url.toString();
    }
    buildUserEmailConfirmationUrl(id, token) {
        return this.buildUrl(["confirmation", "account", "id", id], { token });
    }
    buildUserRecoverPasswordUrl(id, token) {
        return this.buildUrl(["recover", "password", "id", id], { token });
    }
}
exports.UrlBuilder = UrlBuilder;
const createServerUrlBuilderDevelopment = () => {
    return new UrlBuilder("http", network_1.MY_IP_ADDRESS, process_1.env.FASTIFY_PORT);
};
exports.createServerUrlBuilderDevelopment = createServerUrlBuilderDevelopment;
const createFrontUrlBuilderDevelopment = () => {
    return new UrlBuilder("http", network_1.MY_IP_ADDRESS, 3000);
};
exports.createFrontUrlBuilderDevelopment = createFrontUrlBuilderDevelopment;
const createUrlBuilderProduction = () => {
    return new UrlBuilder("https", "");
};
exports.createUrlBuilderProduction = createUrlBuilderProduction;
