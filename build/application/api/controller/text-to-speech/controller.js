"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextToSpeechSpeechController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
const converter_1 = require("../../../usecases/converter");
const platform_express_1 = require("@nestjs/platform-express");
const guard_1 = require("../../guard");
const jsonwebtoken_1 = require("jsonwebtoken");
const fs = require("node:fs");
const path = require("node:path");
let TextToSpeechSpeechController = class TextToSpeechSpeechController {
    constructor(converterAudioToTextUseCase) {
        this.converterAudioToTextUseCase = converterAudioToTextUseCase;
    }
    convertAudioToText(file, response, request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("entered request");
            console.time("justrequest");
            const { userId, email, name } = (0, jsonwebtoken_1.decode)(request.header("Token"));
            const clientUploadedFileName = `${Date.now()}-${file.originalname}`;
            const tempPath = path.join(`/home/muhammadxoja/me/echo-note-backend/webm-files`, clientUploadedFileName);
            fs.writeFileSync(tempPath, file.buffer);
            console.log("file", file);
            console.time("full request");
            console.log("before request");
            // await this.converterAudioToTextUseCase.execute(userId, inputPath, outputPath);
            console.log("after request");
            console.timeEnd("full request");
            console.timeEnd("justrequest");
            response.json({ status: "progress" });
        });
    }
};
exports.TextToSpeechSpeechController = TextToSpeechSpeechController;
tslib_1.__decorate([
    (0, common_1.Post)("audio")
    // @UseInterceptors(
    //     FileInterceptor("file", {
    //         storage: diskStorage({
    //             destination: `/home/muhammadxoja/me/echo-note-backend/webm-files`,
    //             filename: (req, file, cb) => {
    //                 const uniqueName = `${uuid()}${extname(file.originalname)}`;
    //                 cb(null, uniqueName);
    //             },
    //         }),
    //     }),
    // )
    ,
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
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
