import { Inject, Injectable } from "@nestjs/common";
import { NoteRepository } from "app/domain";
import { Infrastructure } from "app/common";

@Injectable()
export class NoteDeleteUseCase {
    constructor(
        @Inject(Infrastructure.Repository.Note)
        private readonly noteRepository: NoteRepository,
    ) {}

    public async execute(noteId: string, userId: string): Promise<void> {
        return this.noteRepository.delete(noteId, userId);
    }
}
