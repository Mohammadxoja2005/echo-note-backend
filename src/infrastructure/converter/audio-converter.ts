import {Injectable} from "@nestjs/common";
import {promisify} from 'util';
import {exec} from "child_process";

const execAsync = promisify(exec);

@Injectable()
export class AudioConverter {
    public async convertWebmToWav(inputPath: string, outputPath: string): Promise<void> {
        const command = `ffmpeg -i "${inputPath}" -acodec pcm_s16le -ar 44100 -ac 2 "${outputPath}"`;

        try {
            const {stdout, stderr} = await execAsync(command);
            console.log('FFmpeg Output:', stdout);
            if (stderr) {
                console.error('FFmpeg Error Output:', stderr);
            }
        } catch (error) {
            console.error('Conversion failed:', error);
            throw new Error('Failed to convert WebM audio to WAV');
        }
    }
}