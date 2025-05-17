export interface MailSender {
    sendMail(to: string, subject: string, link: string): Promise<void>;
}
