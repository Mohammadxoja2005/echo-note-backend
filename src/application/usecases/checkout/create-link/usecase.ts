import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { PaymentProcessor, UserSubscriptionPlan } from "app/domain";

@Injectable()
export class CheckoutCreateLinkUseCase {
    constructor(
        @Inject(Infrastructure.PaymentProcessor.LemonSqueezy)
        private readonly paymentProcessor: PaymentProcessor,
    ) {}

    public async execute(
        subscriptionInfo: {
            store: {
                id: number;
            };
            product: {
                id: number;
            };
            customer: {
                email: string;
                name: string;
            };
        },
        metadata: {
            userId: string;
            plan: UserSubscriptionPlan;
        },
    ): Promise<string> {
        try {
            return this.paymentProcessor.createCheckoutLink(subscriptionInfo, metadata);
        } catch (error) {
            throw new Error("Error creating checkout link", { cause: error });
        }
    }
}
