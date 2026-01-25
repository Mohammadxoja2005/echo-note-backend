import { Module } from "@nestjs/common";
import { OpenAIASR } from "app/infrastructure/asr";
import { Infrastructure } from "app/common";

@Module({
    imports: [],
    providers: [
        {
            provide: Infrastructure.ASR.OpenAI,
            useClass: OpenAIASR,
        },
    ],
    controllers: [],
    exports: [Infrastructure.ASR.OpenAI],
})
export class AsrModule {}
