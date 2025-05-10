import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    console.time("myTimer");

    // function transcribeChunk(filePath) {
    //     return new Promise((resolve, reject) => {
    //         exec(`/home/muhammadxoja/me/whisper-env/bin/python3 /home/muhammadxoja/me/echo-note-backend/transcribe.py "/home/muhammadxoja/me/echo-note-backend/output1.wav"`, (err, stdout, stderr) => {
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
    //     transcribeChunk("").then(text => {
    //         console.log("Transcription:", text)
    //
    //         console.timeEnd("start")
    //     })
    // } catch (err) {
    //     console.log("error", err);
    // }

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
