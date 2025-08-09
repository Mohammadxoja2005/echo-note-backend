"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConverterAudioToTextUseCase = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
const asr_1 = require("../../../../infrastructure/asr");
const fs = require("node:fs");
const types_1 = require("../../../../domain/note/types");
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const path = require("node:path");
const child_process_1 = require("child_process");
const util = require("util");
const p_limit_1 = require("p-limit");
let ConverterAudioToTextUseCase = class ConverterAudioToTextUseCase {
    constructor(openAIASR, noteRepository, user) {
        this.openAIASR = openAIASR;
        this.noteRepository = noteRepository;
        this.user = user;
    }
    execute(userId, webmInputPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.getById(userId);
            const duration = yield this.getDuration(webmInputPath);
            console.log("duration", duration);
            if (duration > 3600 || user.remainingSeconds < duration) {
                fs.unlinkSync(webmInputPath);
                throw new Error("Audio file duration exceeds 1 hour (3600 seconds) or insufficient remaining seconds.");
            }
            const sessionDirId = (0, uuid_1.v4)();
            const chunkDir = path.join("./webm-files", sessionDirId);
            fs.mkdirSync(chunkDir, { recursive: true });
            yield this.splitAudioToChunks(webmInputPath, chunkDir);
            fs.unlinkSync(webmInputPath);
            const note = yield this.noteRepository.create({
                title: "",
                description: "",
                userId: userId,
                status: types_1.NoteStatus.progress,
            });
            this.transcribeChunksAndSave(chunkDir, note.id, userId)
                .then(() => {
                console.log("transcription completed successfully");
                user.remainingSeconds -= duration;
                this.user.updateRemainingSeconds(user.id, user.remainingSeconds);
            })
                .catch((err) => {
                console.error("Background transcription error:", err);
            });
        });
    }
    transcribeChunksAndSave(chunkDir, noteId, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const limit = (0, p_limit_1.default)(5);
            const files = fs
                .readdirSync(chunkDir)
                .filter((f) => f.endsWith(".webm"))
                .sort();
            const transcriptionPromises = files.map((file) => limit(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const filePath = path.join(chunkDir, file);
                return yield this.openAIASR.transcribeAudioToText(filePath);
            })));
            const transcriptions = yield Promise.all(transcriptionPromises);
            const fullTranscript = transcriptions.join("\n");
            yield this.noteRepository.updateTitleAndDescription(noteId, userId, (0, date_fns_1.format)(new Date(), "yyyy-MM-dd"), fullTranscript.trim());
            fs.rmSync(chunkDir, { recursive: true, force: true });
        });
    }
    splitAudioToChunks(inputPath, outputDir) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const outputPattern = path.join(outputDir, "chunk_%03d.webm");
            const execPromise = util.promisify(child_process_1.exec);
            // Detect audio codec
            const { stdout: codecName } = yield execPromise(`ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "${inputPath}"`);
            // Choose command depending on codec
            let cmd;
            if (codecName.trim() === "aac") {
                // Safari → re-encode to opus
                cmd = `ffmpeg -i "${inputPath}" -f segment -segment_time 60 -c:a libopus "${outputPattern}"`;
            }
            else {
                // Chrome/Brave → just copy
                cmd = `ffmpeg -i "${inputPath}" -f segment -segment_time 60 -c copy "${outputPattern}"`;
            }
            return new Promise((resolve, reject) => {
                (0, child_process_1.exec)(cmd, (error) => {
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
        });
    }
    getDuration(filePath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const execPromise = util.promisify(child_process_1.exec);
            const outputPath = path.join(path.dirname(filePath), "repackaged_" + path.basename(filePath));
            try {
                // Detect audio codec
                const codecCmd = `ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "${filePath}"`;
                const { stdout: codecName } = yield execPromise(codecCmd);
                let ffmpegCmd;
                if (codecName.trim() === "aac") {
                    // Safari case → re-encode to opus
                    ffmpegCmd = `ffmpeg -y -i "${filePath}" -c:a libopus "${outputPath}"`;
                }
                else {
                    // Chrome/Brave case → just copy
                    ffmpegCmd = `ffmpeg -y -i "${filePath}" -vcodec copy -acodec copy "${outputPath}"`;
                }
                yield execPromise(ffmpegCmd);
                // Now get duration
                const ffprobeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outputPath}"`;
                const { stdout: durationStr } = yield execPromise(ffprobeCmd);
                fs.unlinkSync(outputPath);
                return parseFloat(durationStr.trim());
            }
            catch (error) {
                console.error("Error getting duration:", error);
                throw new Error("Could not get file duration");
            }
        });
    }
};
exports.ConverterAudioToTextUseCase = ConverterAudioToTextUseCase;
exports.ConverterAudioToTextUseCase = ConverterAudioToTextUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.ASR.OpenAI)),
    tslib_1.__param(1, (0, common_1.Inject)(common_2.Infrastructure.Repository.Note)),
    tslib_1.__param(2, (0, common_1.Inject)(common_2.Infrastructure.Repository.User)),
    tslib_1.__metadata("design:paramtypes", [asr_1.OpenAIASR, Object, Object])
], ConverterAudioToTextUseCase);
