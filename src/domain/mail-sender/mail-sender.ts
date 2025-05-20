export interface MailSender {
    sendMail(mail: { to: string; subject: string; url: string }): Promise<void>;
}
