import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { AudioConverter } from "app/infrastructure/converter";
import { OpenAIASR } from "app/infrastructure/asr";
import * as fs from "node:fs";
import { NoteRepository } from "app/domain";
import { NoteStatus } from "app/domain/note/types";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import * as path from "node:path";
import { exec } from "child_process";

@Injectable()
export class ConverterAudioToTextUseCase {
    constructor(
        @Inject(Infrastructure.Converter.Audio)
        private readonly audioConverter: AudioConverter,
        @Inject(Infrastructure.ASR.OpenAI)
        private readonly openAIASR: OpenAIASR,
        @Inject(Infrastructure.Repository.Note)
        private readonly noteRepository: NoteRepository,
    ) {}

    public async execute(
        userId: string,
        webmInputPath: string,
        wavOutputPath: string,
    ): Promise<void> {
        const sessionDirId = uuidv4();
        const chunkDir = path.join("./webm-files", sessionDirId);

        fs.mkdirSync(chunkDir, { recursive: true });

        await this.splitAudioToChunks(webmInputPath, chunkDir);

        fs.unlinkSync(webmInputPath);

        const note = await this.noteRepository.create({
            title: "",
            description: "",
            userId: userId,
            status: NoteStatus.progress,
        });

        this.transcribeChunksAndSave(chunkDir, note.id, userId).catch((err) => {
            console.error("Background transcription error:", err);
        });
    }

    private async transcribeChunksAndSave(
        chunkDir: string,
        noteId: string,
        userId: string,
    ): Promise<void> {
        const files = fs
            .readdirSync(chunkDir)
            .filter((f) => f.endsWith(".webm"))
            .sort();

        let fullTranscript = "";

        for (const file of files) {
            const filePath = path.join(chunkDir, file);
            const chunkText = await this.openAIASR.transcribeAudioToText(filePath);
            fullTranscript += chunkText + "\n";
        }

        await this.noteRepository.updateTitleAndDescription(
            noteId,
            userId,
            format(new Date(), "yyyy-MM-dd"),
            fullTranscript.trim(),
        );

        fs.rmSync(chunkDir, { recursive: true, force: true });
    }

    private async splitAudioToChunks(inputPath: string, outputDir: string): Promise<void> {
        const outputPattern = path.join(outputDir, "chunk_%03d.webm");

        return new Promise((resolve, reject) => {
            const cmd = `ffmpeg -i "${inputPath}" -f segment -segment_time 60 -c copy "${outputPattern}"`;

            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }

                const files = fs
                    .readdirSync(outputDir)
                    .filter((f) => f.endsWith(".webm"))
                    .map((f) => path.join(outputDir, f));

                // @ts-ignore
                resolve(files);
            });
        });
    }
}
