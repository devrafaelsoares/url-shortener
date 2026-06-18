import { Either, error, success } from "@/helpers";
import { Email } from "@domain/entities";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { EmailService } from "@domain/protocols/providers";

import env from "@env";

export class NodemailerService implements EmailService {
    private transporter: Mail;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.EMAIL_HOST,
            port: parseInt(env.EMAIL_PORT),
            secure: false,
            auth: {
                user: env.EMAIL_USERNAME,
                pass: env.EMAIL_PASSWORD,
            },
        });
    }

    async send(data: Email): Promise<Either<Error, Email | void>> {
        if (env.NODE_ENV === "development") {
            console.log("\n=================== EMAIL MOCK (DEV) ===================");
            console.log(`De: ${data.from}`);
            console.log(`Para: ${data.to}`);
            console.log(`Assunto: ${data.subject}`);
            console.log("--------------------------------------------------------");
            
            // Tenta extrair a URL de dentro do HTML para facilitar o clique no terminal
            const linkMatch = data.html?.match(/href="([^"]+)"/);
            if (linkMatch) {
                console.log(`🔗 Link interceptado: ${linkMatch[1]}\n(Clique acima para acessar a rota)`);
            } else {
                console.log("Conteúdo HTML gerado com sucesso.");
            }
            console.log("========================================================\n");
            return success(undefined);
        }

        try {
            await this.transporter.sendMail({
                from: data.from,
                to: data.to,
                subject: data.subject,
                text: data.text,
                html: data.html,
                attachments: data.attachments,
            });

            return success(undefined);
        } catch (err) {
            const emailError = err instanceof Error ? err : new Error(String(err));
            return error(emailError);
        }
    }
}
