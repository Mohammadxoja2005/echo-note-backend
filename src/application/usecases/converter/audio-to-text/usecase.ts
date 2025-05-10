import {Inject, Injectable} from "@nestjs/common";
import {Infrastructure} from "app/common";
import {AudioConverter} from "app/infrastructure/converter";
import {OpenAIASR} from "app/infrastructure/asr";
import * as fs from "node:fs";

@Injectable()
export class ConverterAudioToTextUseCase {
    constructor(
        @Inject(Infrastructure.Converter.Audio)
        private readonly audioConverter: AudioConverter,
        @Inject(Infrastructure.ASR.OpenAI)
        private readonly openAIASR: OpenAIASR,
    ) {
    }

    public async execute(userId: string, webmInputPath: string, wavOutputPath: string): Promise<void> {
        console.log(userId);
        console.time("convertWebmToWav");
        await this.audioConverter.convertWebmToWav(webmInputPath, wavOutputPath);
        console.timeEnd("convertWebmToWav");

        fs.unlinkSync(webmInputPath);

        console.time("transcribeAudioToText");
        this.openAIASR.transcribeAudioToText(wavOutputPath).then((response) => {
            console.log("response", response);

            fs.unlinkSync(wavOutputPath);
        })
        console.timeEnd("transcribeAudioToText");
    }
}
