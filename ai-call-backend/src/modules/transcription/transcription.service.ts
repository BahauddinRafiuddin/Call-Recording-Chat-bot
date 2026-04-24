import { Injectable } from '@nestjs/common';

@Injectable()
export class TranscriptionService {
  async transcribe(filePath: string): Promise<string> {
    //  Temporary mock (replace with Whisper later)
    await new Promise((res) => setTimeout(res, 3000));

    return `Transcription of file: ${filePath}`;
  }
}