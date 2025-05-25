"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCheckTrialUseCase = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
const domain_1 = require("../../../../domain");
const date_fns_1 = require("date-fns");
let UserCheckTrialUseCase = class UserCheckTrialUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getById(userId);
            if (user.subscription.plan === domain_1.UserSubscriptionPlan.TRIAL) {
                const trialStartDate = new Date(user.createdAt);
                const daysSinceCreation = (0, date_fns_1.differenceInDays)(new Date(), trialStartDate);
                return { isActive: daysSinceCreation <= 7, daysLeft: daysSinceCreation };
            }
            return { isActive: true, daysLeft: 0 };
        });
    }
};
exports.UserCheckTrialUseCase = UserCheckTrialUseCase;
exports.UserCheckTrialUseCase = UserCheckTrialUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.Repository.User)),
    tslib_1.__metadata("design:paramtypes", [Object])
], UserCheckTrialUseCase);
