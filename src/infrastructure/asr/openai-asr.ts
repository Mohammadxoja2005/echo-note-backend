import {Injectable} from "@nestjs/common";
import {exec} from "child_process";

@Injectable()
export class OpenAIASR {
    constructor() {
    }

    public async transcribeAudioToText(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(`${process.env.BASE_PATH}/whisper-env/bin/python3 ${process.env.BASE_PATH}/echo-note-backend/transcribe.py "${filePath}"`, (err, stdout, stderr) => {
                if (err) {
                    return reject(stderr);
                }
                resolve(stdout.trim());
            });
        });
    }
}