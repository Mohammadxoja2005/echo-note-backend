"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginWithMailUseCase = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
let UserLoginWithMailUseCase = class UserLoginWithMailUseCase {
    constructor(mailSender) {
        this.mailSender = mailSender;
    }
    execute(email, token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${process.env.FRONTEND_URL}?token=${token}`;
                yield this.mailSender.sendMail({
                    to: email,
                    subject: "Sign In to EchoNote",
                    url: url,
                });
            }
            catch (error) {
                throw new Error("Error in sending mail", { cause: error });
            }
        });
    }
};
exports.UserLoginWithMailUseCase = UserLoginWithMailUseCase;
exports.UserLoginWithMailUseCase = UserLoginWithMailUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.MailSender)),
    tslib_1.__metadata("design:paramtypes", [Object])
], UserLoginWithMailUseCase);
