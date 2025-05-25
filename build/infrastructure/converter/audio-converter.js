"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioConverter = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const util_1 = require("util");
const child_process_1 = require("child_process");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let AudioConverter = class AudioConverter {
    convertWebmToWav(inputPath, outputPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const command = `ffmpeg -i "${inputPath}" -acodec pcm_s16le -ar 44100 -ac 2 "${outputPath}"`;
            try {
                const { stdout, stderr } = yield execAsync(command);
                console.log('FFmpeg Output:', stdout);
                if (stderr) {
                    console.error('FFmpeg Error Output:', stderr);
                }
            }
            catch (error) {
                console.error('Conversion failed:', error);
                throw new Error('Failed to convert WebM audio to WAV');
            }
        });
    }
};
exports.AudioConverter = AudioConverter;
exports.AudioConverter = AudioConverter = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AudioConverter);
