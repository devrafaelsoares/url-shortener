"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuidV4IdProvider = void 0;
const uuid_1 = require("uuid");
class UuidV4IdProvider {
    generate() {
        return (0, uuid_1.v4)();
    }
}
exports.UuidV4IdProvider = UuidV4IdProvider;
