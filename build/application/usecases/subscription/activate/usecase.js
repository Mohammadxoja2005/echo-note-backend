"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionActivateUseCase = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const domain_1 = require("../../../../domain");
const common_2 = require("../../../../common");
let SubscriptionActivateUseCase = class SubscriptionActivateUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.getById(user.id);
            if (!foundUser) {
                throw new Error("User not found");
            }
            if (user.subscription.plan === domain_1.UserSubscriptionPlan.PLUS) {
                yield this.updatePlanToPlus(user);
            }
        });
    }
    updatePlanToPlus(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.userRepository.updatePlan({
                id: user.id,
                isActive: user.isActive,
                subscription: user.subscription,
            });
        });
    }
};
exports.SubscriptionActivateUseCase = SubscriptionActivateUseCase;
exports.SubscriptionActivateUseCase = SubscriptionActivateUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.Repository.User)),
    tslib_1.__metadata("design:paramtypes", [Object])
], SubscriptionActivateUseCase);
