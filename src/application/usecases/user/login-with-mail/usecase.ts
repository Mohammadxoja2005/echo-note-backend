import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { MailSender } from "app/domain/mail-sender";

@Injectable()
export class UserLoginWithMailUseCase {
    constructor(@Inject(Infrastructure.MailSender) private mailSender: MailSender) {}

    public async execute(email: string, token: string): Promise<void> {
        try {
            const url = `${process.env.FRONTEND_URL}?token=${token}`;

            await this.mailSender.sendMail({
                to: email,
                subject: "Login with email",
                url: url,
            });
        } catch (error) {
            throw new Error("Error in sending mail", { cause: error });
        }
    }
}
