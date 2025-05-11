import {Inject, Injectable} from "@nestjs/common";
import {Infrastructure} from "app/common";
import {AudioConverter} from "app/infrastructure/converter";
import {OpenAIASR} from "app/infrastructure/asr";
import * as fs from "node:fs";
import {NoteRepository} from "app/domain";
import {NoteStatus} from "app/domain/note/types";
import {format} from 'date-fns';

@Injectable()
export class ConverterAudioToTextUseCase {
    constructor(
        @Inject(Infrastructure.Converter.Audio)
        private readonly audioConverter: AudioConverter,
        @Inject(Infrastructure.ASR.OpenAI)
        private readonly openAIASR: OpenAIASR,
        @Inject(Infrastructure.Repository.Note)
        private readonly noteRepository: NoteRepository,
    ) {
    }

    public async execute(userId: string, webmInputPath: string, wavOutputPath: string): Promise<void> {
        await this.audioConverter.convertWebmToWav(webmInputPath, wavOutputPath);

        fs.unlinkSync(webmInputPath);

        const note = await this.noteRepository.create({
            title: "",
            description: "",
            userId: userId,
            status: NoteStatus.progress
        })

        this.openAIASR.transcribeAudioToText(wavOutputPath).then(async (description) => {
            await this.noteRepository.updateTitleAndDescription(
                note.id,
                userId,
                format(new Date(), 'yyyy-MM-dd'),
                description
            );

            fs.unlinkSync(wavOutputPath);
        })
    }
}
