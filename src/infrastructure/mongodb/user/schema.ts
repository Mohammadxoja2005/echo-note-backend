import { Schema } from "mongoose";
import { UserHydratedDocument } from "./document";
import { Collections } from "app/infrastructure/schema";

export const UserSchema = new Schema<UserHydratedDocument>(
    {
        name: String,
        email: String,
        picture: String,
        is_active: Boolean,
        oauth: {
            google_id: String,
        },
        subscription: {
            id: { type: String, default: null },
            plan: String,
        },
        remaining_seconds: { type: Number, default: 0 },
        last_visit: { type: Date, default: Date.now },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
        collection: Collections.User,
    },
);
