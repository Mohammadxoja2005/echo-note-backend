import {Controller, Inject, Post, Res, UploadedFile, UseInterceptors} from "@nestjs/common";
import {Application} from "app/common";
import {ConverterAudioToTextUseCase} from "app/application/usecases/converter";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer"
import {extname} from "path"
import {v4 as uuid} from 'uuid';
import {Response} from "express";

@Controller("text-to-speech")
export class TextToSpeechSpeechController {
    constructor(
        @Inject(Application.ConverterAudioToTextUseCase)
        private readonly converterAudioToTextUseCase: ConverterAudioToTextUseCase) {
    }

    @Post('audio')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: '/home/muhammadxoja/me/echo-note-backend/webm-files',
                filename: (req, file, cb) => {
                    const uniqueName = `${uuid()}${extname(file.originalname)}`;
                    cb(null, uniqueName);
                },
            }),
        }),
    )
    async convertAudioToText(@UploadedFile() file: any, @Res() response: Response) {
        const inputPath = file.path;
        const outputPath = inputPath.replace('.webm', '.wav');

        await this.converterAudioToTextUseCase.execute(inputPath, outputPath);

        response.json({status: "progress"});
    }
}