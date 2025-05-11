import {HydratedDocument, Types} from "mongoose";
import {NoteStatus} from "app/domain/note/types";

export type NoteDocument = {
    _id: Types.ObjectId;
    title: string;
    description: string;
    user_id: Types.ObjectId;
    status: NoteStatus
    created_at: Date;
    updated_at: Date;
};

export type NoteCreateDocument = Omit<NoteDocument, "_id" | "created_at" | "updated_at">;

export type NoteHydratedDocument = HydratedDocument<NoteDocument>;