"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionCancelUseCase = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
let SubscriptionCancelUseCase = class SubscriptionCancelUseCase {
    constructor(paymentProcessor, userRepository) {
        this.paymentProcessor = paymentProcessor;
        this.userRepository = userRepository;
    }
    execute(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getById(userId);
                if (user.subscription.id === null) {
                    throw new Error("User does not have an active subscription");
                }
                yield this.paymentProcessor.cancelSubscription(user.subscription.id);
            }
            catch (error) {
                throw new Error("Error canceling subscription", { cause: error });
            }
        });
    }
};
exports.SubscriptionCancelUseCase = SubscriptionCancelUseCase;
exports.SubscriptionCancelUseCase = SubscriptionCancelUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.PaymentProcessor.LemonSqueezy)),
    tslib_1.__param(1, (0, common_1.Inject)(common_2.Infrastructure.Repository.User)),
    tslib_1.__metadata("design:paramtypes", [Object, Object])
], SubscriptionCancelUseCase);
