"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const authenticate_1 = require("../../../usecases/user/authenticate");
const guard_1 = require("../../guard");
const jsonwebtoken_1 = require("jsonwebtoken");
const get_profile_1 = require("../../../usecases/user/get-profile");
const passport_1 = require("@nestjs/passport");
const common_2 = require("../../../../common");
const check_trial_1 = require("../../../usecases/user/check-trial");
const usecase_1 = require("../../../usecases/user/update-status/usecase");
const usecase_2 = require("../../../usecases/user/login-with-mail/usecase");
const update_remaining_seconds_1 = require("../../../usecases/user/update-remaining-seconds");
let UserController = class UserController {
    constructor(userAuthenticateUseCase, userGetProfile, userCheckTrialUseCase, userUpdateStatusUseCase, userLoginWithEmailUseCase, userUpdateRemainingSecondsUseCase) {
        this.userAuthenticateUseCase = userAuthenticateUseCase;
        this.userGetProfile = userGetProfile;
        this.userCheckTrialUseCase = userCheckTrialUseCase;
        this.userUpdateStatusUseCase = userUpdateStatusUseCase;
        this.userLoginWithEmailUseCase = userLoginWithEmailUseCase;
        this.userUpdateRemainingSecondsUseCase = userUpdateRemainingSecondsUseCase;
    }
    googleAuth() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () { });
    }
    googleAuthCallback(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const user = yield this.userAuthenticateUseCase.execute({
                name: (_a = request.user._json.name) !== null && _a !== void 0 ? _a : null,
                email: (_b = request.user._json.email) !== null && _b !== void 0 ? _b : null,
                googleId: request.user.id,
                picture: (_c = request.user._json.picture) !== null && _c !== void 0 ? _c : null,
            });
            const frontendUrl = `${process.env.FRONTEND_URL}?token=${user.token}`;
            response.redirect(frontendUrl);
        });
    }
    authByEmail(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { email } = request.body;
            const user = yield this.userAuthenticateUseCase.execute({
                name: null,
                email: email,
                googleId: "",
                picture: null,
            });
            yield this.userLoginWithEmailUseCase.execute(email, user.token);
            response.status(200).json({ result: "email sent successfully." });
        });
    }
    getProfile(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { userId, email, name } = (0, jsonwebtoken_1.decode)(request.header("Token"));
            console.log("User ID:", userId);
            yield this.userUpdateRemainingSecondsUseCase.execute(userId);
            const { isActive, daysLeft } = yield this.userCheckTrialUseCase.execute(userId);
            if (!isActive) {
                yield this.userUpdateStatusUseCase.execute(userId, { active: false });
                const user = yield this.userGetProfile.execute(userId);
                // response.status(HttpStatus.FORBIDDEN).json({ status: "trial expired" });
                response.status(200).json({ user: user, daysLeft: 7 - daysLeft });
                return;
            }
            const user = yield this.userGetProfile.execute(userId);
            response.status(200).json({ user: user, daysLeft: 7 - daysLeft });
        });
    }
};
exports.UserController = UserController;
tslib_1.__decorate([
    (0, common_1.Get)("google"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("google")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "googleAuth", null);
tslib_1.__decorate([
    (0, common_1.Get)("google/callback"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("google")),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "googleAuthCallback", null);
tslib_1.__decorate([
    (0, common_1.Post)("email"),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "authByEmail", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guard_1.AuthGuard),
    (0, common_1.Post)("profile"),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
exports.UserController = UserController = tslib_1.__decorate([
    (0, common_1.Controller)("user"),
    tslib_1.__param(2, (0, common_1.Inject)(common_2.Application.UseCase.UserCheckTrial)),
    tslib_1.__param(3, (0, common_1.Inject)(common_2.Application.UseCase.UserUpdateStatus)),
    tslib_1.__metadata("design:paramtypes", [authenticate_1.UserAuthenticateUseCase,
        get_profile_1.UserGetProfile,
        check_trial_1.UserCheckTrialUseCase,
        usecase_1.UserUpdateStatusUseCase,
        usecase_2.UserLoginWithMailUseCase,
        update_remaining_seconds_1.UserUpdateRemainingSecondsUseCase])
], UserController);
