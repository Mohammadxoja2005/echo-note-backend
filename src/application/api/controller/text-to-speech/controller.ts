import {
    Body,
    Controller,
    Inject,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { Application } from "app/common";
import { ConverterAudioToTextUseCase } from "app/application/usecases/converter";
import { v4 as uuid } from "uuid";
import { Response, Request } from "express";
import { AuthGuard } from "app/application/api/guard";
import { decode, JwtPayload } from "jsonwebtoken";
import * as fs from "node:fs";
import * as path from "node:path";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "node:stream";

@UseGuards(AuthGuard)
@Controller("text-to-speech")
export class TextToSpeechSpeechController {
    constructor(
        @Inject(Application.ConverterAudioToTextUseCase)
        private readonly converterAudioToTextUseCase: ConverterAudioToTextUseCase,
    ) {}

    @Post("audio")
    async convertAudioToText(
        @Body() body: { key: string },
        @Res() response: Response,
        @Req() request: Request,
    ) {
        const { userId } = decode(request.header("Token") as string) as JwtPayload;

        const client = new S3Client({
            endpoint: process.env.CONTABO_S3_ENDPOINT,
            region: process.env.CONTABO_S3_REGION ?? "default",
            credentials: {
                accessKeyId: process.env.CONTABO_S3_ACCESS_KEY as string,
                secretAccessKey: process.env.CONTABO_S3_SECRET_KEY as string,
            },
            forcePathStyle: true,
        });

        const s3Object = await client.send(
            new GetObjectCommand({
                Bucket: process.env.CONTABO_S3_BUCKET as string,
                Key: body.key,
            }),
        );

        const fileName = `${Date.now()}-${path.basename(body.key)}`;
        const tempPath = path.join(
            `${process.env.BASE_PATH}/echo-note-backend/webm-files`,
            fileName,
        );

        const fileStream = fs.createWriteStream(tempPath);
        await new Promise<void>((resolve, reject) => {
            (s3Object.Body as Readable).pipe(fileStream).on("finish", resolve).on("error", reject);
        });

        this.converterAudioToTextUseCase.execute(userId, tempPath).catch((err) => {
            console.error("Background transcription error:", err);
        });

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
