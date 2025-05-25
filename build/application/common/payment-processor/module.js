"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProcessorModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const lemon_squeezy_1 = require("../../../infrastructure/payment-processor/lemon-squeezy");
const common_2 = require("../../../common");
let PaymentProcessorModule = class PaymentProcessorModule {
};
exports.PaymentProcessorModule = PaymentProcessorModule;
exports.PaymentProcessorModule = PaymentProcessorModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: common_2.Infrastructure.PaymentProcessor.LemonSqueezy,
                useClass: lemon_squeezy_1.PaymentProcessorLemonSqueezy,
            },
        ],
        exports: [common_2.Infrastructure.PaymentProcessor.LemonSqueezy],
    })
], PaymentProcessorModule);
