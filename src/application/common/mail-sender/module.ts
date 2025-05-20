import { Module } from "@nestjs/common";
import { MailSenderImpl } from "app/infrastructure/mail-sender";
import { Infrastructure } from "app/common";

@Module({
    imports: [],
    controllers: [],
    providers: [
        {
            provide: Infrastructure.MailSender,
            useClass: MailSenderImpl,
        },
    ],
    exports: [Infrastructure.MailSender],
})
export class MailSenderModule {}
