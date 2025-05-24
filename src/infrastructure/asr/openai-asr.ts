import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as fs from "node:fs";
import * as FormData from "form-data";

@Injectable()
export class OpenAIASR {
    constructor() {}

    public async transcribeAudioToText(filePath: string): Promise<string> {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));
        formData.append("model", "whisper-1");
        formData.append("response_format", "text");

        const response = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    ...formData.getHeaders(),
                },
            },
        );

        return response.data;
    }
}
