import {Inject, Injectable} from "@nestjs/common";
import {Note, NoteRepository} from "app/domain";
import {Infrastructure} from "app/common";

@Injectable()
export class NoteGetUseCase {
    constructor(
        @Inject(Infrastructure.Repository.Note)
        private readonly noteRepository: NoteRepository
    ) {
    }

    public async execute(noteId: string, userId: string): Promise<Note> {
        return this.noteRepository.getById(noteId, userId);
    }
}