"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProcesserEvent = exports.PaymentProcessorTransactionStatus = exports.PaymentProcessorSubscription = void 0;
exports.PaymentProcessorSubscription = {
    Store: {
        Id: 158685,
    },
    Product: {
        Id: {
            Plus: 797928,
        },
    },
};
var PaymentProcessorTransactionStatus;
(function (PaymentProcessorTransactionStatus) {
    PaymentProcessorTransactionStatus["ACTIVE"] = "active";
    PaymentProcessorTransactionStatus["CANCELLED"] = "cancelled";
    PaymentProcessorTransactionStatus["PAID"] = "paid";
})(PaymentProcessorTransactionStatus || (exports.PaymentProcessorTransactionStatus = PaymentProcessorTransactionStatus = {}));
var PaymentProcesserEvent;
(function (PaymentProcesserEvent) {
    PaymentProcesserEvent["SUBSCRIPTION_UPDATED"] = "subscription_updated";
    PaymentProcesserEvent["SUBSCRIPTION_PAYMENT_SUCCESS"] = "subscription_payment_success";
    PaymentProcesserEvent["SUBSCRIPTION_CANCELLED"] = "subscription_cancelled";
    PaymentProcesserEvent["SUBSCRIPTION_RESUMED"] = "subscription_resumed";
    PaymentProcesserEvent["SUBSCRIPTION_PAYMENT_FAILED"] = "subscription_payment_failed";
    PaymentProcesserEvent["SUBSCRIPTION_PLAN_CHANGED"] = "subscription_plan_changed";
    PaymentProcesserEvent["SUBSCRIPTION_EXPIRED"] = "subscription_expired";
    PaymentProcesserEvent["SUBSCRIPTION_CREATED"] = "subscription_created";
    PaymentProcesserEvent["SUBSCRIPTION_PAUSED"] = "subscription_paused";
})(PaymentProcesserEvent || (exports.PaymentProcesserEvent = PaymentProcesserEvent = {}));
