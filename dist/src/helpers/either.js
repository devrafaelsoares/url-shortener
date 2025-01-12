"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = exports.error = exports.Success = exports.Error = void 0;
class Error {
    constructor(value) {
        this.value = value;
    }
    isError() {
        return true;
    }
    isSuccess() {
        return false;
    }
}
exports.Error = Error;
class Success {
    constructor(value) {
        this.value = value;
    }
    isError() {
        return false;
    }
    isSuccess() {
        return true;
    }
}
exports.Success = Success;
const error = (l) => {
    return new Error(l);
};
exports.error = error;
const success = (a) => {
    return new Success(a);
};
exports.success = success;
