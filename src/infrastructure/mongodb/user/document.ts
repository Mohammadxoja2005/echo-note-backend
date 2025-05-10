import {HydratedDocument, Types} from "mongoose";
import {UserSubscription} from "app/domain";

export type UserDocument = {
    _id: Types.ObjectId;
    name: string | null;
    email: string | null;
    picture: string | null;
    is_active: boolean;
    subscription: UserSubscription;
    oauth: {
        google_id: string;
    };
    created_at: string;
    updated_at: string;
};

export type UserCreateDocument = Omit<UserDocument, "_id" | "created_at" | "updated_at">;

export type UserHydratedDocument = HydratedDocument<UserDocument>;
