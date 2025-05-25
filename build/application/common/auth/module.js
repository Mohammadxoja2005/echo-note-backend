"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const tslib_1 = require("tslib");
const google_1 = require("../../../infrastructure/auth/strategies/google");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule.register({ defaultStrategy: "google" })],
        providers: [google_1.AuthGoogleStrategy],
    })
], AuthModule);
