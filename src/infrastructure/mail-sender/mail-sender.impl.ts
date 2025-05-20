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
        await this.transporter.sendMail({
            from: `"EchoNote" <${process.env.EMAIL_USER}>`,
            to: mail.to,
            subject: mail.subject,
            html: `
            <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f4f2ff; padding: 40px 20px;">
                <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 32px; text-align: center;">
                    <h2 style="color: #2b2b2b;">🔒 Secure Login to EchoNote</h2>
                    <p style="color: #555; font-size: 16px; line-height: 1.5;">
                        Click the button below to log in to your EchoNote account. This magic link is valid for a limited time.
                    </p>
<a href="${mail.url || "https://google.com"}"
   style="display: inline-block;
          margin-top: 24px;
          padding: 16px 32px;
          background-color: #a78bfa;
          color: white;
          border-radius: 10px;
          text-decoration: none;
          font-weight: bold;
          font-size: 18px;">
    Sign In Now
</a>
                    <p style="margin-top: 30px; font-size: 14px; color: #888;">
                        If the button doesn't work, copy and paste this link into your browser:<br/>
                        <a href="${mail.url || "https://google.com"}" style="color: #7c3aed;">${mail.url || "https://google.com"}</a>
                    </p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #aaa;">You’re receiving this email because someone requested to sign in to EchoNote using this address.</p>
                </div>
            </div>
        `,
        });
    }
}
