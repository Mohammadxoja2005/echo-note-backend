import {Module} from "@nestjs/common";
import {TextToSpeechSpeechController} from "app/application/api/controller/text-to-speech";
import {ConverterAudioToTextUseCase} from "app/application/usecases/converter";
import {Application, Infrastructure} from "app/common";
import {AudioConverter} from "app/infrastructure/converter";
import {AsrModule} from "app/application/common/asr";
import {UserModule} from "app/application/common/user/module";
import {NoteModule} from "app/application/common/note";

@Module({
    imports: [AsrModule, UserModule, NoteModule],
    providers: [
        {
            provide: Application.ConverterAudioToTextUseCase,
            useClass: ConverterAudioToTextUseCase
        },
        {
            provide: Infrastructure.Converter.Audio,
            useClass: AudioConverter
        }
    ],
    controllers: [TextToSpeechSpeechController],
    exports: [
        Application.ConverterAudioToTextUseCase,
        Infrastructure.Converter.Audio,
        Application.ConverterAudioToTextUseCase
    ],
})
export class ConverterModule {
}
