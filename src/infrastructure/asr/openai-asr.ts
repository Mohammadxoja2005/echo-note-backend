import {Injectable} from "@nestjs/common";
import {exec} from "child_process";

@Injectable()
export class OpenAIASR {
    constructor() {
    }

    public async transcribeAudioToText(audioFile: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(`/home/muhammadxoja/me/whisper-env/bin/python3 /home/muhammadxoja/me/echo-note-backend/transcribe.py "/home/muhammadxoja/me/echo-note-backend/files/${audioFile}"`, (err, stdout, stderr) => {
                if (err) {
                    return reject(stderr)
                }
                resolve(stdout.trim());
            });
        });
    }
}