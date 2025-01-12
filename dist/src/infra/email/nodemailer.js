"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerService = void 0;
const helpers_1 = require("../../helpers");
const nodemailer_1 = __importDefault(require("nodemailer"));
class NodemailerService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    send(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendMailPromise = new Promise(resolve => {
                this.transporter.sendMail({
                    from: data.from,
                    to: data.to,
                    subject: data.subject,
                    text: data.text,
                    html: data.html,
                    attachments: data.attachments,
                }, (err, info) => {
                    if (err) {
                        console.error("Erro ao enviar e-mail:", err);
                        resolve((0, helpers_1.error)(err));
                    }
                    else {
                        resolve((0, helpers_1.success)(undefined));
                    }
                });
            });
            setImmediate(() => sendMailPromise);
            return (0, helpers_1.success)(undefined);
        });
    }
}
exports.NodemailerService = NodemailerService;
