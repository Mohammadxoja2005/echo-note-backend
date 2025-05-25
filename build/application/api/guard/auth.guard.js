"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
let AuthGuard = class AuthGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.header("Token");
        try {
            const isValidToken = (0, jsonwebtoken_1.verify)(token, `${process.env.JWT_SECRET_KEY}`);
            if (isValidToken) {
                return true;
            }
        }
        catch (error) {
            return false;
        }
        return false;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AuthGuard);
