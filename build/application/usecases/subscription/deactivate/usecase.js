"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionDeactivateUseCase = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
let SubscriptionDeactivateUseCase = class SubscriptionDeactivateUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.userRepository.updatePlan({
                id: user.id,
                isActive: user.isActive,
                subscription: user.subscription,
            });
        });
    }
};
exports.SubscriptionDeactivateUseCase = SubscriptionDeactivateUseCase;
exports.SubscriptionDeactivateUseCase = SubscriptionDeactivateUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.Repository.User)),
    tslib_1.__metadata("design:paramtypes", [Object])
], SubscriptionDeactivateUseCase);
