"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthenticateUseCase = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
const domain_1 = require("../../../../domain");
const jsonwebtoken_1 = require("jsonwebtoken");
let UserAuthenticateUseCase = class UserAuthenticateUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.create({
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    isActive: true,
                    oauth: {
                        googleId: user.googleId,
                    },
                    remainingSeconds: 3600,
                    lastVisit: new Date(),
                    subscription: {
                        id: null,
                        plan: domain_1.UserSubscriptionPlan.TRIAL,
                    },
                });
                const foundUser = yield this.userRepository.getByGoogleId(user.googleId);
                const accessToken = (0, jsonwebtoken_1.sign)({ userId: foundUser.id, email: foundUser.email, name: foundUser.name }, `${process.env.JWT_SECRET_KEY}`);
                return { user: foundUser, token: accessToken };
            }
            catch (error) {
                throw new Error("Error in authenticating user", { cause: error });
            }
        });
    }
};
exports.UserAuthenticateUseCase = UserAuthenticateUseCase;
exports.UserAuthenticateUseCase = UserAuthenticateUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.Repository.User)),
    tslib_1.__metadata("design:paramtypes", [Object])
], UserAuthenticateUseCase);
