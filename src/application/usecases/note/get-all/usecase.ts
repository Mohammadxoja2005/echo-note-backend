import {Inject, Injectable} from "@nestjs/common";
import {Note, NoteRepository} from "app/domain";
import {Infrastructure} from "app/common";

@Injectable()
export class NoteGetAllUseCase {
    constructor(
        @Inject(Infrastructure.Repository.Note)
        private readonly noteRepository: NoteRepository
    ) {
    }

    public async execute(userId: string, page: number): Promise<{ notes: Note[]; totalPages: number }> {
        return this.noteRepository.getAll(userId, page);
    }
}
