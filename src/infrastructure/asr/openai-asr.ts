import {Injectable} from "@nestjs/common";
import {exec} from "child_process";

@Injectable()
export class OpenAIASR {
    constructor() {
    }

    public async transcribeAudioToText(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(`/home/muhammadxoja/me/whisper-env/bin/python3 /home/muhammadxoja/me/echo-note-backend/transcribe.py "${filePath}"`, (err, stdout, stderr) => {
                if (err) {
                    return reject(stderr);
                }
                resolve(stdout.trim());
            });
        });
    }
}