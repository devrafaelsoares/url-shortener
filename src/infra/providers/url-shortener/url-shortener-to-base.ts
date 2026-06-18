import { IdProvider, ToBaseProvider, UrlShortenerProvider } from "@domain/protocols/providers";

import crypto from "crypto";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export class UrlShortenerToBase implements UrlShortenerProvider {
    constructor(private toBase: ToBaseProvider, private idProvider: IdProvider) {}

    shorten(): string {
        // Performance & AppSec: Native Base62 cryptographic generation (O(1) nanoseconds)
        // Removes CPU bottlenecks from UUID parsing and BigInt math.
        let id = "";
        const bytes = crypto.randomBytes(7);
        for (let i = 0; i < 7; i++) {
            id += BASE62[bytes[i] % 62];
        }
        return id;
    }
}
