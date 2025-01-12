"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExistsEntityError = void 0;
class ExistsEntityError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.ExistsEntityError = ExistsEntityError;
