import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // function transcribeChunk(filePath) {
    //     return new Promise((resolve, reject) => {
    //         exec(`/home/muhammadxoja/me/whisper-env/bin/python3 /home/muhammadxoja/me/echo-note-backend/transcribe.py "/home/muhammadxoja/me/echo-note-backend/output.wav"`, (err, stdout, stderr) => {
    //             if (err) {
    //                 console.log("error", err);
    //                 return reject(stderr)
    //             }
    //             resolve(stdout.trim());
    //         });
    //     });
    // }

    // try {
    //     console.time("start");
    //     const result = await transcribeChunk("");
    //
    //     console.log(result);
    //
    //     console.timeEnd("start");
    // } catch (err) {
    //     console.log("error", err);
    // }

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
