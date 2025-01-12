"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cuid2IdProvider = void 0;
const cuid2_1 = require("@paralleldrive/cuid2");
class Cuid2IdProvider {
    generate() {
        return (0, cuid2_1.createId)();
    }
}
exports.Cuid2IdProvider = Cuid2IdProvider;
