"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlFactory = void 0;
const entities_1 = require("../entities");
const validators_1 = require("../validators");
const url_shortener_1 = require("../../infra/providers/url-shortener");
const to_base_1 = require("../../infra/providers/to-base");
const id_1 = require("../../infra/providers/id");
class UrlFactory {
    createProps(overrides = {}) {
        return Object.assign({ originalUrl: "Url title", expiresAt: new Date() }, overrides);
    }
    createEntity(overrides = {}) {
        const urlProps = this.createProps(Object.assign({}, overrides));
        const urlValidatorSimple = new validators_1.UrlValidatorSimple();
        const url = entities_1.Url.create({
            props: urlProps,
            providers: {
                idProvider: new id_1.Cuid2IdProvider(),
                urlShortenerProvider: new url_shortener_1.UrlShortenerToBase(new to_base_1.ToBase62(), new id_1.UuidV4IdProvider()),
            },
            validator: urlValidatorSimple,
        });
        return url.value;
    }
}
exports.UrlFactory = UrlFactory;
