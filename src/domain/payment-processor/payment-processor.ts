import {UserSubscriptionPlan} from "app/domain";

export interface PaymentProcessor {
    createCheckoutLink(
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
    ): Promise<string>;

    cancelSubscription(id: string): Promise<void>;
}
