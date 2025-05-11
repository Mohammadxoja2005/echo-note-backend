import { Controller, Headers, Inject, Post, RawBodyRequest, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import {
    PaymentProcesserEvent,
    PaymentProcessorTransaction,
    PaymentProcessorTransactionStatus,
    UserSubscriptionPlan,
} from "app/domain";
import * as crypto from "node:crypto";
import * as process from "node:process";
import { SubscriptionActivateUseCase } from "app/application/usecases/subscription/activate";
import { SubscriptionDeactivateUseCase } from "app/application/usecases/subscription/deactivate";

@Controller("webhook/subscription")
export class WebhookSubscriptionController {
    constructor(
        private readonly subscriptionActivateUseCase: SubscriptionActivateUseCase,
        private readonly subscriptionDeactivateUseCase: SubscriptionDeactivateUseCase,
    ) {}

    @Post("handle-payment-status")
    async handlePaymentStatus(
        @Req() request: RawBodyRequest<Request>,
        @Res() response: Response,
        @Headers("X-Signature") signature: string,
    ) {
        const transaction: PaymentProcessorTransaction = request.body;

        const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE || "");

        const digest = Buffer.from(hmac.update(request.rawBody || "").digest("hex"), "utf8");
        const expectedSignature = Buffer.from(signature, "utf8");

        if (!crypto.timingSafeEqual(digest, expectedSignature)) {
            throw new Error("Invalid signature.");
        }

        if (
            [
                PaymentProcesserEvent.SUBSCRIPTION_PAYMENT_SUCCESS,
                PaymentProcesserEvent.SUBSCRIPTION_PLAN_CHANGED,
                PaymentProcesserEvent.SUBSCRIPTION_CREATED,
                PaymentProcesserEvent.SUBSCRIPTION_RESUMED,
            ].includes(transaction.meta.event_name) ||
            [
                PaymentProcessorTransactionStatus.ACTIVE,
                PaymentProcessorTransactionStatus.PAID,
            ].includes(transaction.data.attributes.status)
        ) {
            const userId = transaction.meta.custom_data.userId;
            const plan = transaction.meta.custom_data.plan;
            const subscriptionId = transaction.data.id;

            await this.subscriptionActivateUseCase.execute({
                id: userId,
                isActive: true,
                subscription: {
                    id: subscriptionId,
                    plan: plan,
                },
            });
        }

        if (
            [
                PaymentProcesserEvent.SUBSCRIPTION_CANCELLED,
                PaymentProcesserEvent.SUBSCRIPTION_PAYMENT_FAILED,
                PaymentProcesserEvent.SUBSCRIPTION_EXPIRED,
                PaymentProcesserEvent.SUBSCRIPTION_PAUSED,
            ].includes(transaction.meta.event_name) ||
            [PaymentProcessorTransactionStatus.CANCELLED].includes(
                transaction.data.attributes.status,
            )
        ) {
            const userId = transaction.meta.custom_data.userId;

            await this.subscriptionDeactivateUseCase.execute({
                id: userId,
                isActive: false,
                subscription: {
                    id: null,
                    plan: UserSubscriptionPlan.TRIAL,
                },
            });
        }

        response.status(200).send("Webhook received successfully");
    }
}
