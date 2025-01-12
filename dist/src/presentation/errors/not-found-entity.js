"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundEntityError = void 0;
class NotFoundEntityError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.NotFoundEntityError = NotFoundEntityError;
