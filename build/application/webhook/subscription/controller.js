"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookSubscriptionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const domain_1 = require("../../../domain");
const crypto = require("node:crypto");
const process = require("node:process");
const activate_1 = require("../../usecases/subscription/activate");
const deactivate_1 = require("../../usecases/subscription/deactivate");
let WebhookSubscriptionController = class WebhookSubscriptionController {
    constructor(subscriptionActivateUseCase, subscriptionDeactivateUseCase) {
        this.subscriptionActivateUseCase = subscriptionActivateUseCase;
        this.subscriptionDeactivateUseCase = subscriptionDeactivateUseCase;
    }
    handlePaymentStatus(request, response, signature) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const transaction = request.body;
            const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE || "");
            const digest = Buffer.from(hmac.update(request.rawBody || "").digest("hex"), "utf8");
            const expectedSignature = Buffer.from(signature, "utf8");
            if (!crypto.timingSafeEqual(digest, expectedSignature)) {
                throw new Error("Invalid signature.");
            }
            if ([
                domain_1.PaymentProcesserEvent.SUBSCRIPTION_PAYMENT_SUCCESS,
                domain_1.PaymentProcesserEvent.SUBSCRIPTION_PLAN_CHANGED,
                domain_1.PaymentProcesserEvent.SUBSCRIPTION_CREATED,
                domain_1.PaymentProcesserEvent.SUBSCRIPTION_RESUMED,
            ].includes(transaction.meta.event_name) ||
                [
                    domain_1.PaymentProcessorTransactionStatus.ACTIVE,
                    domain_1.PaymentProcessorTransactionStatus.PAID,
                ].includes(transaction.data.attributes.status)) {
                const userId = transaction.meta.custom_data.userId;
                const plan = transaction.meta.custom_data.plan;
                const subscriptionId = transaction.data.id;
                yield this.subscriptionActivateUseCase.execute({
                    id: userId,
                    isActive: true,
                    subscription: {
                        id: subscriptionId,
                        plan: plan,
                    },
                });
            }
            if ([
                domain_1.PaymentProcesserEvent.SUBSCRIPTION_CANCELLED,
                domain_1.PaymentProcesserEvent.SUBSCRIPTION_PAYMENT_FAILED,
                domain_1.PaymentProcesserEvent.SUBSCRIPTION_EXPIRED,
                domain_1.PaymentProcesserEvent.SUBSCRIPTION_PAUSED,
            ].includes(transaction.meta.event_name) ||
                [domain_1.PaymentProcessorTransactionStatus.CANCELLED].includes(transaction.data.attributes.status)) {
                const userId = transaction.meta.custom_data.userId;
                yield this.subscriptionDeactivateUseCase.execute({
                    id: userId,
                    isActive: false,
                    subscription: {
                        id: null,
                        plan: domain_1.UserSubscriptionPlan.TRIAL,
                    },
                });
            }
            response.status(200).send("Webhook received successfully");
        });
    }
};
exports.WebhookSubscriptionController = WebhookSubscriptionController;
tslib_1.__decorate([
    (0, common_1.Post)("handle-payment-status"),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__param(2, (0, common_1.Headers)("X-Signature")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], WebhookSubscriptionController.prototype, "handlePaymentStatus", null);
exports.WebhookSubscriptionController = WebhookSubscriptionController = tslib_1.__decorate([
    (0, common_1.Controller)("webhook/subscription"),
    tslib_1.__metadata("design:paramtypes", [activate_1.SubscriptionActivateUseCase,
        deactivate_1.SubscriptionDeactivateUseCase])
], WebhookSubscriptionController);
