import { NoteStatus } from "app/domain/note/types";

export type Note = {
    id: string;
    title: string;
    description: string;
    summerizedText: string;
    userId: string;
    status: NoteStatus;
    createdAt: Date;
    updatedAt: Date;
};
