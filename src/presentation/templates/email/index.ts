import { readFileSync } from "fs";
import { resolve } from "path";

const encoding = "utf-8";

export const userEmailConfirmationTemplateHtml = readFileSync(resolve(__dirname, "user-email-confirmation.html"), {
    encoding,
});

export const userRecoverPasswordTemplateHtml = readFileSync(resolve(__dirname, "user-recover-password.html"), {
    encoding,
});

export const userEmailConfirmationApiTemplateHtml = readFileSync(
    resolve(__dirname, "user-email-confirmation-api.html"),
    {
        encoding,
    }
);

export const userRecoverPasswordApiTemplateHtml = readFileSync(resolve(__dirname, "user-recover-password-api.html"), {
    encoding,
});
