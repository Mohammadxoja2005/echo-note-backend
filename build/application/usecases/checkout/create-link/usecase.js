"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutCreateLinkUseCase = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
let CheckoutCreateLinkUseCase = class CheckoutCreateLinkUseCase {
    constructor(paymentProcessor) {
        this.paymentProcessor = paymentProcessor;
    }
    execute(subscriptionInfo, metadata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return this.paymentProcessor.createCheckoutLink(subscriptionInfo, metadata);
            }
            catch (error) {
                throw new Error("Error creating checkout link", { cause: error });
            }
        });
    }
};
exports.CheckoutCreateLinkUseCase = CheckoutCreateLinkUseCase;
exports.CheckoutCreateLinkUseCase = CheckoutCreateLinkUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.PaymentProcessor.LemonSqueezy)),
    tslib_1.__metadata("design:paramtypes", [Object])
], CheckoutCreateLinkUseCase);
