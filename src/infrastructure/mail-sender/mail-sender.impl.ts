import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { MailSender } from "app/domain/mail-sender";

@Injectable()
export class MailSenderImpl implements MailSender {
    private transporter = nodemailer.createTransport({
        service: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.ZOHO_USER,
            pass: process.env.ZOHO_PASS,
        },
    });

    public async sendMail(to: string, subject: string, link: string) {
        await this.transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: `<p>Click <a href="${link || "https://google.com"}">here</a> to log in.</p>`,
        });
    }
}
