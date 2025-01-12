"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedEntityError = void 0;
class UnauthorizedEntityError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.UnauthorizedEntityError = UnauthorizedEntityError;
