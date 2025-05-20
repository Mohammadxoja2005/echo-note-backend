import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { MailSender } from "app/domain/mail-sender";

@Injectable()
export class MailSenderImpl implements MailSender {
    private transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.ZOHO_USER,
            pass: process.env.ZOHO_PASS,
        },
    });

    public async sendMail(mail: { to: string; subject: string; url: string }) {
        console.log("process.env.ZOHO_USER", process.env.ZOHO_USER);
        console.log("process.env.ZOHO_PASS", process.env.ZOHO_PASS);

        await this.transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,
            to: mail.to,
            subject: mail.subject,
            html: `<p>Click <a href="${mail.url || "https://google.com"}">here</a> to log in.</p>`,
        });
    }
}
