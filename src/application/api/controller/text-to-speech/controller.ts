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
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

    @Post("presigned-url")
    async getPresignedUrl(@Req() request: Request, @Res() response: Response) {
        const { userId } = decode(request.header("Token") as string) as JwtPayload;

        const key = `audio/${userId}/${Date.now()}-${uuid()}.webm`;

        const client = new S3Client({
            endpoint: process.env.CONTABO_S3_ENDPOINT,
            region: process.env.CONTABO_S3_REGION ?? "default",
            credentials: {
                accessKeyId: process.env.CONTABO_S3_ACCESS_KEY as string,
                secretAccessKey: process.env.CONTABO_S3_SECRET_KEY as string,
            },
            forcePathStyle: true,
        });

        const command = new PutObjectCommand({
            Bucket: process.env.CONTABO_S3_BUCKET as string,
            Key: key,
            ContentType: "audio/webm",
        });

        const url = await getSignedUrl(client, command, { expiresIn: 300 });

        response.json({ url, key });
    }
}
