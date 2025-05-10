import {UserSubscription} from "app/domain/user/subscription/subscription";

export type User = {
    id: string;
    isActive: boolean;
    name: string | null;
    email: string | null;
    picture: string | null;
    oauth: {
        googleId: string;
    };
    subscription: UserSubscription;
}