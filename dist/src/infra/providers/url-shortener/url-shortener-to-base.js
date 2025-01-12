"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlShortenerToBase = void 0;
class UrlShortenerToBase {
    constructor(toBase, idProvider) {
        this.toBase = toBase;
        this.idProvider = idProvider;
    }
    shorten() {
        const hex = "0x" + this.idProvider.generate().replace(/-/g, "");
        const decimal = BigInt(hex);
        const shiftedDecimal = decimal / BigInt(Math.pow(10, (decimal.toString().length - 13)));
        const id = this.toBase.hash(Number(shiftedDecimal));
        return id;
    }
}
exports.UrlShortenerToBase = UrlShortenerToBase;
