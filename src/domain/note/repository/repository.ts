import { Note } from "app/domain";

export interface NoteRepository {
    create(note: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note>;

    getById(id: string, userId: string): Promise<Note>;

    getAll(userId: string, page: number): Promise<{ notes: Note[]; totalPages: number }>;

    updateTitleAndDescription(
        id: string,
        userId: string,
        title: string,
        description: string,
    ): Promise<void>;

    updateTitleAndSummarizedText(
        id: string,
        userId: string,
        title: string,
        description: string,
        summarizedText: string,
    ): Promise<void>;
}
