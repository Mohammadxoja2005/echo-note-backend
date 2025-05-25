"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGoogleStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
let AuthGoogleStrategy = class AuthGoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, "google") {
    constructor() {
        var _a, _b;
        super({
            clientID: (_a = process.env.GOOGLE_CLIENT_ID) !== null && _a !== void 0 ? _a : " ",
            clientSecret: (_b = process.env.GOOGLE_CLIENT_SECRET) !== null && _b !== void 0 ? _b : " ",
            callbackURL: process.env.CALLBACK_URL,
            scope: ["profile", "email"],
        });
    }
    validate(_accessToken, _refreshToken, profile) {
        return profile;
    }
};
exports.AuthGoogleStrategy = AuthGoogleStrategy;
exports.AuthGoogleStrategy = AuthGoogleStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], AuthGoogleStrategy);
