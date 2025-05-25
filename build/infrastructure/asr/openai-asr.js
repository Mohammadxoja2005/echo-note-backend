"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIASR = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const fs = require("node:fs");
let OpenAIASR = class OpenAIASR {
    constructor() { }
    transcribeAudioToText(filePath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const audioData = fs.readFileSync(filePath);
            const uploadResponse = yield axios_1.default.post(`https://api.assemblyai.com/v2/upload`, audioData, {
                headers: {
                    authorization: `${process.env.ASSEMBLY_KEY}`,
                },
            });
            const audioUrl = uploadResponse.data.upload_url;
            const response = yield axios_1.default.post("https://api.assemblyai.com/v2/transcript", {
                audio_url: audioUrl,
                speech_model: "nano",
            }, {
                headers: {
                    authorization: `${process.env.ASSEMBLY_KEY}`,
                },
            });
            const transcriptId = response.data.id;
            while (true) {
                const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
                const pollingResponse = yield axios_1.default.get(pollingEndpoint, {
                    headers: {
                        authorization: `${process.env.ASSEMBLY_KEY}`,
                    },
                });
                const transcriptionResult = pollingResponse.data;
                if (transcriptionResult.status === "completed") {
                    return transcriptionResult.text;
                }
                else if (transcriptionResult.status === "error") {
                    throw new Error(`Transcription failed: ${transcriptionResult.error}`);
                }
                else {
                    yield new Promise((resolve) => setTimeout(resolve, 3000));
                }
            }
        });
    }
};
exports.OpenAIASR = OpenAIASR;
exports.OpenAIASR = OpenAIASR = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], OpenAIASR);
