"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConverterModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const text_to_speech_1 = require("../../api/controller/text-to-speech");
const converter_1 = require("../../usecases/converter");
const common_2 = require("../../../common");
const converter_2 = require("../../../infrastructure/converter");
const asr_1 = require("../asr");
const module_1 = require("../user/module");
const note_1 = require("../note");
let ConverterModule = class ConverterModule {
};
exports.ConverterModule = ConverterModule;
exports.ConverterModule = ConverterModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [asr_1.AsrModule, module_1.UserModule, note_1.NoteModule],
        providers: [
            {
                provide: common_2.Application.ConverterAudioToTextUseCase,
                useClass: converter_1.ConverterAudioToTextUseCase
            },
            {
                provide: common_2.Infrastructure.Converter.Audio,
                useClass: converter_2.AudioConverter
            }
        ],
        controllers: [text_to_speech_1.TextToSpeechSpeechController],
        exports: [
            common_2.Application.ConverterAudioToTextUseCase,
            common_2.Infrastructure.Converter.Audio,
            common_2.Application.ConverterAudioToTextUseCase
        ],
    })
], ConverterModule);
