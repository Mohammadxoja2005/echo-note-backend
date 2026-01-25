import { UserSubscriptionPlan } from "app/domain/user/subscription/plan";

export type UserSubscription = {
    id: string | null;
    plan: UserSubscriptionPlan;
};
