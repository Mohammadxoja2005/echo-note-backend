import {
    Controller,
    Inject,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { Application } from "app/common";
import { ConverterAudioToTextUseCase } from "app/application/usecases/converter";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuid } from "uuid";
import { Response, Request } from "express";
import { AuthGuard } from "app/application/api/guard";
import { decode, JwtPayload } from "jsonwebtoken";
import { UserCheckTrialUseCase } from "app/application/usecases/user/check-trial";
import { UserUpdateStatusUseCase } from "app/application/usecases/user/update-status/usecase";
import * as fs from "node:fs";
import * as path from "node:path";

@UseGuards(AuthGuard)
@Controller("text-to-speech")
export class TextToSpeechSpeechController {
    constructor(
        @Inject(Application.ConverterAudioToTextUseCase)
        private readonly converterAudioToTextUseCase: ConverterAudioToTextUseCase,
    ) {}

    @Post("audio")
    @UseInterceptors(FileInterceptor("file"))
    async convertAudioToText(
        @UploadedFile() file: any,
        @Res() response: Response,
        @Req() request: Request,
    ) {
        console.log("entered request");
        console.time("justrequest");
        const { userId, email, name } = decode(request.header("Token") as string) as JwtPayload;

        const clientUploadedFileName = `${Date.now()}-${file.originalname}`;

        const tempPath = path.join(
            `${process.env.BASE_PATH}/echo-note-backend/webm-files`,
            clientUploadedFileName,
        );

        fs.writeFileSync(tempPath, file.buffer);

        console.time("full request");
        console.log("before request");

        await this.converterAudioToTextUseCase.execute(userId, tempPath);
        console.log("after request");

        console.timeEnd("full request");

        console.timeEnd("justrequest");

        response.json({ status: "progress" });
    }
}
