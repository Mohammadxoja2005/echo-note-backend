import { UserSubscriptionPlan } from "app/domain";

export const PaymentProcessorSubscription = {
    Store: {
        Id: 158685,
    },
    Product: {
        Id: {
            Plus: 797928,
        },
    },
};

export type PaymentProcessorTransaction = {
    meta: {
        test_mode: boolean;
        event_name: PaymentProcesserEvent;
        custom_data: { plan: UserSubscriptionPlan; userId: string };
        webhook_id: string;
    };
    data: {
        type: string;
        id: string;
        attributes: {
            store_id: number;
            customer_id: number;
            order_id: number;
            order_item_id: number;
            product_id: number;
            variant_id: number;
            product_name: string;
            user_name: string;
            user_email: string;
            status: PaymentProcessorTransactionStatus;
        };
    };
};

export enum PaymentProcessorTransactionStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled",
    PAID = "paid",
}

export enum PaymentProcesserEvent {
    SUBSCRIPTION_UPDATED = "subscription_updated",
    SUBSCRIPTION_PAYMENT_SUCCESS = "subscription_payment_success",
    SUBSCRIPTION_CANCELLED = "subscription_cancelled",
    SUBSCRIPTION_RESUMED = "subscription_resumed",
    SUBSCRIPTION_PAYMENT_FAILED = "subscription_payment_failed",
    SUBSCRIPTION_PLAN_CHANGED = "subscription_plan_changed",
    SUBSCRIPTION_EXPIRED = "subscription_expired",
    SUBSCRIPTION_CREATED = "subscription_created",
    SUBSCRIPTION_PAUSED = "subscription_paused",
}
