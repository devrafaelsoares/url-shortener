"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToBase62 = void 0;
class ToBase62 {
    hash(number) {
        const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let result = "";
        let current = number;
        if (number === 0)
            return "0";
        const isNegative = number < 0;
        if (isNegative)
            current = Math.abs(current);
        while (current > 0) {
            const remainder = current % 62;
            result = digits[remainder] + result;
            current = Math.floor(current / 62);
        }
        return isNegative ? `-${result}` : result;
    }
}
exports.ToBase62 = ToBase62;
