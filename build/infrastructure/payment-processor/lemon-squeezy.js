"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProcessorLemonSqueezy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const process = require("node:process");
let PaymentProcessorLemonSqueezy = class PaymentProcessorLemonSqueezy {
    constructor() {
        this.baseUrl = "https://api.lemonsqueezy.com/v1";
    }
    createCheckoutLink(subscriptionInfo, metadata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseUrl}/checkouts`, {
                data: {
                    type: "checkouts",
                    attributes: {
                        store_id: subscriptionInfo.store.id,
                        variant_id: subscriptionInfo.product.id,
                        checkout_data: {
                            email: subscriptionInfo.customer.email,
                            name: subscriptionInfo.customer.name,
                            custom: metadata,
                        },
                    },
                    relationships: {
                        store: {
                            data: {
                                id: subscriptionInfo.store.id.toString(),
                                type: "stores",
                            },
                        },
                        variant: {
                            data: {
                                id: subscriptionInfo.product.id.toString(),
                                type: "variants",
                            },
                        },
                    },
                },
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.LEMON_SQUEEZY_KEY}`,
                },
                timeout: 10000,
            });
            return response.data.data.attributes.url;
        });
    }
    cancelSubscription(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseUrl}/subscriptions/${id}`, {
                headers: {
                    Authorization: `Bearer ${process.env.LEMON_SQUEEZY_KEY}`,
                },
                timeout: 10000,
            });
        });
    }
};
exports.PaymentProcessorLemonSqueezy = PaymentProcessorLemonSqueezy;
exports.PaymentProcessorLemonSqueezy = PaymentProcessorLemonSqueezy = tslib_1.__decorate([
    (0, common_1.Injectable)()
], PaymentProcessorLemonSqueezy);
