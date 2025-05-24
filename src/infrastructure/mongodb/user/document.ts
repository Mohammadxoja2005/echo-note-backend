import { HydratedDocument, Types } from "mongoose";
import { UserSubscription } from "app/domain";

export type UserDocument = {
    _id: Types.ObjectId;
    name: string | null;
    email: string | null;
    picture: string | null;
    is_active: boolean;
    subscription: UserSubscription;
    remaining_seconds: number;
    oauth: {
        google_id: string;
    };
    last_visit: Date;
    created_at: Date;
    updated_at: Date;
};

export type UserCreateDocument = Omit<UserDocument, "_id" | "created_at" | "updated_at">;

export type UserHydratedDocument = HydratedDocument<UserDocument>;
