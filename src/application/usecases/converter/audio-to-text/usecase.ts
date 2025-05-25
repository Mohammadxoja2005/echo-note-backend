import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { OpenAIASR } from "app/infrastructure/asr";
import * as fs from "node:fs";
import { NoteRepository, UserRepository } from "app/domain";
import { NoteStatus } from "app/domain/note/types";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import * as path from "node:path";
import { exec } from "child_process";
import * as util from "util";
import pLimit from "p-limit";

@Injectable()
export class ConverterAudioToTextUseCase {
    constructor(
        @Inject(Infrastructure.ASR.OpenAI)
        private readonly openAIASR: OpenAIASR,
        @Inject(Infrastructure.Repository.Note)
        private readonly noteRepository: NoteRepository,
        @Inject(Infrastructure.Repository.User)
        private readonly user: UserRepository,
    ) {}

    public async execute(
        userId: string,
        webmInputPath: string,
        wavOutputPath: string,
    ): Promise<void> {
        const user = await this.user.getById(userId);
        const duration = await this.getDuration(webmInputPath);

        if (duration > 3600 || user.remainingSeconds < duration) {
            fs.unlinkSync(webmInputPath);

            throw new Error(
                "Audio file duration exceeds 1 hour (3600 seconds) or insufficient remaining seconds.",
            );
        }

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

        this.transcribeChunksAndSave(chunkDir, note.id, userId)
            .then(async () => {
                console.log("transcription completed successfully");
                user.remainingSeconds -= duration;
                await this.user.updateRemainingSeconds(user.id, user.remainingSeconds);
            })
            .catch((err) => {
                console.error("Background transcription error:", err);
            });
    }

    private async transcribeChunksAndSave(
        chunkDir: string,
        noteId: string,
        userId: string,
    ): Promise<void> {
        const limit = pLimit(5);

        const files = fs
            .readdirSync(chunkDir)
            .filter((f) => f.endsWith(".webm"))
            .sort();

        const transcriptionPromises = files.map((file) =>
            limit(async () => {
                const filePath = path.join(chunkDir, file);
                return await this.openAIASR.transcribeAudioToText(filePath);
            }),
        );

        const transcriptions = await Promise.all(transcriptionPromises);

        const fullTranscript = transcriptions.join("\n");

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

    async getDuration(filePath: string): Promise<number> {
        const execPromise = util.promisify(exec);

        const outputPath = path.join(
            path.dirname(filePath),
            "repackaged_" + path.basename(filePath),
        );

        const ffmpegCmd = `ffmpeg -y -i "${filePath}" -vcodec copy -acodec copy "${outputPath}"`;
        const ffprobeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${outputPath}`;

        try {
            await execPromise(ffmpegCmd);

            const { stdout } = await execPromise(ffprobeCmd);

            fs.unlinkSync(outputPath);
            return parseFloat(stdout.trim());
        } catch (error) {
            console.error("Error getting duration:", error);
            throw new Error("Could not get file duration");
        }
    }
}
