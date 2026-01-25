import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { NoteRepository } from "app/domain";

@Injectable()
export class NoteUpdateTitleAndDescription {
    constructor(
        @Inject(Infrastructure.Repository.Note)
        private readonly noteRepository: NoteRepository,
    ) {}

    public async execute(
        id: string,
        userId: string,
        title: string,
        description: string,
    ): Promise<void> {
        await this.noteRepository.updateTitleAndDescription(id, userId, title, description);
    }
}
