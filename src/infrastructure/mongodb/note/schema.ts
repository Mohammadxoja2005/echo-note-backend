import { Schema, Types } from "mongoose";
import { Collections } from "app/infrastructure/schema";
import { NoteHydratedDocument } from "app/infrastructure/mongodb/note/document";

export const NoteSchema = new Schema<NoteHydratedDocument>(
    {
        title: String,
        description: String,
        user_id: Types.ObjectId,
        status: String,
        summerized_text: String,
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
        collection: Collections.Note,
    },
);
