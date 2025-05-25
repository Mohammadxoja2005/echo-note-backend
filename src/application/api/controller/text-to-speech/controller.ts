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

@UseGuards(AuthGuard)
@Controller("text-to-speech")
export class TextToSpeechSpeechController {
    constructor(
        @Inject(Application.ConverterAudioToTextUseCase)
        private readonly converterAudioToTextUseCase: ConverterAudioToTextUseCase,
    ) {}

    @Post("audio")
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
    async convertAudioToText(
        // @UploadedFile() file: any,
        @Res() response: Response,
        @Req() request: Request,
    ) {
        console.log("entered request");
        console.time("justrequest");
        const { userId, email, name } = decode(request.header("Token") as string) as JwtPayload;

        // const inputPath = file.path;
        // const outputPath = inputPath.replace(".webm", ".wav");

        console.time("full request");
        console.log("before request")

        // await this.converterAudioToTextUseCase.execute(userId, inputPath, outputPath);
        console.log("after request");

        console.timeEnd("full request");

        console.timeEnd("justrequest");

        response.json({ status: "progress" });
    }
}
