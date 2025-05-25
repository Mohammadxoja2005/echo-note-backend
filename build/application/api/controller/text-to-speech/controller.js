"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextToSpeechSpeechController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
const converter_1 = require("../../../usecases/converter");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const guard_1 = require("../../guard");
const jsonwebtoken_1 = require("jsonwebtoken");
let TextToSpeechSpeechController = class TextToSpeechSpeechController {
    constructor(converterAudioToTextUseCase) {
        this.converterAudioToTextUseCase = converterAudioToTextUseCase;
    }
    convertAudioToText(file, response, request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { userId, email, name } = (0, jsonwebtoken_1.decode)(request.header("Token"));
            const inputPath = file.path;
            const outputPath = inputPath.replace(".webm", ".wav");
            console.time("full request");
            yield this.converterAudioToTextUseCase.execute(userId, inputPath, outputPath);
            console.timeEnd("full request");
            response.json({ status: "progress" });
        });
    }
};
exports.TextToSpeechSpeechController = TextToSpeechSpeechController;
tslib_1.__decorate([
    (0, common_1.Post)("audio"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: `/home/muhammadxoja/me/echo-note-backend/webm-files`,
            filename: (req, file, cb) => {
                const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                cb(null, uniqueName);
            },
        }),
    })),
    tslib_1.__param(0, (0, common_1.UploadedFile)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TextToSpeechSpeechController.prototype, "convertAudioToText", null);
exports.TextToSpeechSpeechController = TextToSpeechSpeechController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guard_1.AuthGuard),
    (0, common_1.Controller)("text-to-speech"),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Application.ConverterAudioToTextUseCase)),
    tslib_1.__metadata("design:paramtypes", [converter_1.ConverterAudioToTextUseCase])
], TextToSpeechSpeechController);
