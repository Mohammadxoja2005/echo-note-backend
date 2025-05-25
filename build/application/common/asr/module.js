"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsrModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const asr_1 = require("../../../infrastructure/asr");
const common_2 = require("../../../common");
let AsrModule = class AsrModule {
};
exports.AsrModule = AsrModule;
exports.AsrModule = AsrModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [
            {
                provide: common_2.Infrastructure.ASR.OpenAI,
                useClass: asr_1.OpenAIASR
            }
        ],
        controllers: [],
        exports: [common_2.Infrastructure.ASR.OpenAI],
    })
], AsrModule);
