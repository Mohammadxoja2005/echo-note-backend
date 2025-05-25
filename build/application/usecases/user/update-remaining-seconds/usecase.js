"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateRemainingSecondsUseCase = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
const domain_1 = require("../../../../domain");
let UserUpdateRemainingSecondsUseCase = class UserUpdateRemainingSecondsUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const todayStr = now.toISOString().slice(0, 10);
                const user = yield this.userRepository.getById(userId);
                const lastVisitStr = user.lastVisit.toISOString().slice(0, 10);
                if (lastVisitStr !== todayStr &&
                    user.subscription.plan !== domain_1.UserSubscriptionPlan.TRIAL) {
                    yield this.userRepository.updateRemainingSeconds(userId, 3600);
                }
            }
            catch (error) {
                throw new Error("Error updating remaining seconds", { cause: error });
            }
        });
    }
};
exports.UserUpdateRemainingSecondsUseCase = UserUpdateRemainingSecondsUseCase;
exports.UserUpdateRemainingSecondsUseCase = UserUpdateRemainingSecondsUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.Repository.User)),
    tslib_1.__metadata("design:paramtypes", [Object])
], UserUpdateRemainingSecondsUseCase);
