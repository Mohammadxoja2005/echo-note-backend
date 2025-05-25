"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("../mongoose");
const user_1 = require("../../../infrastructure/mongodb/user");
const common_2 = require("../../../common");
const mongoose_2 = require("@nestjs/mongoose");
const schema_1 = require("../../../infrastructure/schema");
const schema_2 = require("../../../infrastructure/mongodb/user/schema");
const user_2 = require("../../api/controller/user");
const get_profile_1 = require("../../usecases/user/get-profile");
const authenticate_1 = require("../../usecases/user/authenticate");
const auth_1 = require("../auth");
const check_trial_1 = require("../../usecases/user/check-trial");
const usecase_1 = require("../../usecases/user/update-status/usecase");
const usecase_2 = require("../../usecases/user/login-with-mail/usecase");
const mail_sender_1 = require("../mail-sender");
const update_remaining_seconds_1 = require("../../usecases/user/update-remaining-seconds");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            auth_1.AuthModule,
            mongoose_1.MongooseModule,
            mongoose_2.MongooseModule.forFeature([
                {
                    name: schema_1.Collections.User,
                    schema: schema_2.UserSchema,
                },
            ]),
            mail_sender_1.MailSenderModule,
        ],
        providers: [
            {
                provide: common_2.Infrastructure.Repository.User,
                useClass: user_1.UserRepositoryImpl,
            },
            {
                provide: common_2.Application.UseCase.UserCheckTrial,
                useClass: check_trial_1.UserCheckTrialUseCase,
            },
            {
                provide: common_2.Application.UseCase.UserUpdateStatus,
                useClass: usecase_1.UserUpdateStatusUseCase,
            },
            get_profile_1.UserGetProfile,
            authenticate_1.UserAuthenticateUseCase,
            usecase_2.UserLoginWithMailUseCase,
            update_remaining_seconds_1.UserUpdateRemainingSecondsUseCase
        ],
        controllers: [user_2.UserController],
        exports: [
            common_2.Infrastructure.Repository.User,
            common_2.Application.UseCase.UserCheckTrial,
            common_2.Application.UseCase.UserUpdateStatus,
        ],
    })
], UserModule);
