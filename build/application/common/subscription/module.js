"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cancel_1 = require("../../usecases/subscription/cancel");
const controller_1 = require("../../api/controller/subscription/controller");
const common_2 = require("../../../common");
const module_1 = require("../user/module");
const payment_processor_1 = require("../payment-processor");
const activate_1 = require("../../usecases/subscription/activate");
const deactivate_1 = require("../../usecases/subscription/deactivate");
const subscription_1 = require("../../webhook/subscription");
let SubscriptionModule = class SubscriptionModule {
};
exports.SubscriptionModule = SubscriptionModule;
exports.SubscriptionModule = SubscriptionModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [module_1.UserModule, payment_processor_1.PaymentProcessorModule],
        providers: [
            {
                provide: common_2.Application.UseCase.SubscriptionCancel,
                useClass: cancel_1.SubscriptionCancelUseCase,
            },
            activate_1.SubscriptionActivateUseCase,
            deactivate_1.SubscriptionDeactivateUseCase,
        ],
        controllers: [controller_1.SubscriptionController, subscription_1.WebhookSubscriptionController],
        exports: [common_2.Application.UseCase.SubscriptionCancel],
    })
], SubscriptionModule);
