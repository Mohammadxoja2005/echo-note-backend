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
        private readonly userRepository: UserRepository,
    ) {}

    public async execute(userId: string, webmInputPath: string): Promise<void> {
        const user = await this.userRepository.getById(userId);
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
            .then(() => {
                console.log("transcription completed successfully");
                user.remainingSeconds -= duration;

                this.userRepository.updateRemainingSeconds(user.id, user.remainingSeconds);
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

    private async splitAudioToChunks(inputPath: string, outputDir: string): Promise<string[]> {
        const outputPattern = path.join(outputDir, "chunk_%03d.webm");
        const execPromise = util.promisify(exec);

        // Detect audio codec
        const { stdout: codecName } = await execPromise(
            `ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "${inputPath}"`,
        );

        // Choose command depending on codec
        let cmd;
        if (codecName.trim() === "aac") {
            // Safari → re-encode to opus
            cmd = `ffmpeg -i "${inputPath}" -f segment -segment_time 60 -c:a libopus "${outputPattern}"`;
        } else {
            // Chrome/Brave → just copy
            cmd = `ffmpeg -i "${inputPath}" -f segment -segment_time 60 -c copy "${outputPattern}"`;
        }

        return new Promise((resolve, reject) => {
            exec(cmd, (error) => {
                if (error) {
                    return reject(error);
                }

                const files = fs
                    .readdirSync(outputDir)
                    .filter((f) => f.endsWith(".webm"))
                    .map((f) => path.join(outputDir, f));

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

        try {
            // Detect audio codec
            const codecCmd = `ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "${filePath}"`;
            const { stdout: codecName } = await execPromise(codecCmd);

            let ffmpegCmd;
            if (codecName.trim() === "aac") {
                // Safari case → re-encode to opus
                ffmpegCmd = `ffmpeg -y -i "${filePath}" -c:a libopus "${outputPath}"`;
            } else {
                // Chrome/Brave case → just copy
                ffmpegCmd = `ffmpeg -y -i "${filePath}" -vcodec copy -acodec copy "${outputPath}"`;
            }

            await execPromise(ffmpegCmd);

            // Now get duration
            const ffprobeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outputPath}"`;
            const { stdout: durationStr } = await execPromise(ffprobeCmd);

            fs.unlinkSync(outputPath);
            return parseFloat(durationStr.trim());
        } catch (error) {
            console.error("Error getting duration:", error);
            throw new Error("Could not get file duration");
        }
    }
}
