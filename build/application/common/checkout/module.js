"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const checkout_1 = require("../../api/controller/checkout");
const create_link_1 = require("../../usecases/checkout/create-link");
const payment_processor_1 = require("../payment-processor");
let CheckoutModule = class CheckoutModule {
};
exports.CheckoutModule = CheckoutModule;
exports.CheckoutModule = CheckoutModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [payment_processor_1.PaymentProcessorModule],
        providers: [create_link_1.CheckoutCreateLinkUseCase],
        controllers: [checkout_1.CheckoutController],
    })
], CheckoutModule);
