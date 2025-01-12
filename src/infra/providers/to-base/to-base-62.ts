import { ToBaseProvider } from "@domain/protocols/providers";

export class ToBase62 implements ToBaseProvider {
    hash(number: number): string {
        const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let result = "";
        let current = number;

        if (number === 0) return "0";

        const isNegative = number < 0;
        if (isNegative) current = Math.abs(current);

        while (current > 0) {
            const remainder = current % 62;
            result = digits[remainder] + result;
            current = Math.floor(current / 62);
        }

        return isNegative ? `-${result}` : result;
    }
}
