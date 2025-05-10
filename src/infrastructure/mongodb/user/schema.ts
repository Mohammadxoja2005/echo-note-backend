import {Schema} from "mongoose";
import {UserHydratedDocument} from "./document";
import {Collections} from "app/infrastructure/schema";

export const UserSchema = new Schema<UserHydratedDocument>(
    {
        name: String,
        email: String,
        picture: String,
        is_active: Boolean,
        oauth: {
            googleId: String,
        },
        subscription: {
            id: {type: String, default: null},
            plan: String,
        },
    },
    {
        timestamps: {createdAt: "created_at", updatedAt: "updated_at"},
        versionKey: false,
        collection: Collections.User,
    },
);
