import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as fs from "node:fs";
import OpenAI from "openai";

@Injectable()
export class OpenAIASR {
    constructor() {}

    public async transcribeAudioToText(filePath: string): Promise<string> {
        const audioData = fs.readFileSync(filePath);
        const uploadResponse = await axios.post(`https://api.assemblyai.com/v2/upload`, audioData, {
            headers: {
                authorization: `${process.env.ASSEMBLY_KEY}`,
            },
        });

        const audioUrl = uploadResponse.data.upload_url;

        const response = await axios.post(
            "https://api.assemblyai.com/v2/transcript",
            {
                audio_url: audioUrl,
                speech_model: "nano",
            },
            {
                headers: {
                    authorization: `${process.env.ASSEMBLY_KEY}`,
                },
            },
        );

        const transcriptId = response.data.id;

        while (true) {
            const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

            const pollingResponse = await axios.get(pollingEndpoint, {
                headers: {
                    authorization: `${process.env.ASSEMBLY_KEY}`,
                },
            });

            const transcriptionResult = pollingResponse.data;

            if (transcriptionResult.status === "completed") {
                return transcriptionResult.text;
            } else if (transcriptionResult.status === "error") {
                throw new Error(`Transcription failed: ${transcriptionResult.error}`);
            } else {
                await new Promise((resolve) => setTimeout(resolve, 3000));
            }
        }
    }

    public summarize(text: string): Promise<string> {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant that summarizes text clearly and concisely.",
                },
                {
                    role: "user",
                    content: `Summarize the following text:\n\n${text}`,
                },
            ],
            temperature: 0.3,
        });

        return response.choices[0].message.content ?? "";
    }
}
