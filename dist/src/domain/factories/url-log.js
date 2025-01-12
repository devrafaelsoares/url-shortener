"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlLogFactory = void 0;
const entities_1 = require("../entities");
const validators_1 = require("../validators");
const id_1 = require("../../infra/providers/id");
class UrlLogFactory {
    createProps(overrides = {}) {
        return Object.assign({ ipAddress: "", accessedAt: new Date(), urlId: "" }, overrides);
    }
    createEntity(overrides = {}) {
        const urlProps = this.createProps(Object.assign({}, overrides));
        const urlValidatorSimple = new validators_1.UrlLogValidatorSimple();
        const url = entities_1.UrlLog.create({
            props: urlProps,
            providers: {
                idProvider: new id_1.Cuid2IdProvider(),
            },
            validator: urlValidatorSimple,
        });
        return url.value;
    }
}
exports.UrlLogFactory = UrlLogFactory;
