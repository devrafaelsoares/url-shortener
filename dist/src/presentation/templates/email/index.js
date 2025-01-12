"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRecoverPasswordApiTemplateHtml = exports.userEmailConfirmationApiTemplateHtml = exports.userRecoverPasswordTemplateHtml = exports.userEmailConfirmationTemplateHtml = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const encoding = "utf-8";
exports.userEmailConfirmationTemplateHtml = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, "user-email-confirmation.html"), {
    encoding,
});
exports.userRecoverPasswordTemplateHtml = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, "user-recover-password.html"), {
    encoding,
});
exports.userEmailConfirmationApiTemplateHtml = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, "user-email-confirmation-api.html"), {
    encoding,
});
exports.userRecoverPasswordApiTemplateHtml = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, "user-recover-password-api.html"), {
    encoding,
});
