"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestEntityError = void 0;
class BadRequestEntityError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.BadRequestEntityError = BadRequestEntityError;
