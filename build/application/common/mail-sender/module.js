"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailSenderModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mail_sender_1 = require("../../../infrastructure/mail-sender");
const common_2 = require("../../../common");
let MailSenderModule = class MailSenderModule {
};
exports.MailSenderModule = MailSenderModule;
exports.MailSenderModule = MailSenderModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [],
        providers: [
            {
                provide: common_2.Infrastructure.MailSender,
                useClass: mail_sender_1.MailSenderImpl,
            },
        ],
        exports: [common_2.Infrastructure.MailSender],
    })
], MailSenderModule);
