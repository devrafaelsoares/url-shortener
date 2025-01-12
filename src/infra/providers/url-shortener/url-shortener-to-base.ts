import { IdProvider, ToBaseProvider, UrlShortenerProvider } from "@domain/protocols/providers";

export class UrlShortenerToBase implements UrlShortenerProvider {
    constructor(private toBase: ToBaseProvider, private idProvider: IdProvider) {}

    shorten(): string {
        const hex = "0x" + this.idProvider.generate().replace(/-/g, "");
        const decimal = BigInt(hex);
        const shiftedDecimal = decimal / BigInt(10 ** (decimal.toString().length - 13));
        const id = this.toBase.hash(Number(shiftedDecimal));

        return id;
    }
}
