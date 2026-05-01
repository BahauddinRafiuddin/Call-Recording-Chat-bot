import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class TranscriptionService {

  private PYTHON_PATH = "C:\\Users\\Rafiuddin\\AppData\\Local\\Programs\\Python\\Python313\\python.exe";

  // 🔥 SPLIT AUDIO INTO CHUNKS
  async splitAudio(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(process.cwd(), filePath);
      const outputDir = path.dirname(fullPath);

      const outputPattern = path.join(outputDir, 'chunk_%03d.wav');

      const ffmpeg = spawn('ffmpeg', [
        '-i', fullPath,
        '-f', 'segment',
        '-segment_time', '120', // 2 min chunks
        '-c', 'copy',
        outputPattern,
      ]);

      ffmpeg.on('close', (code) => {
        if (code !== 0) return reject("FFmpeg split failed");

        const files = fs
          .readdirSync(outputDir)
          .filter(f => f.startsWith('chunk_') && f.endsWith('.wav'))
          .map(f => path.join(outputDir, f));

        resolve(files);
      });
    });
  }

  // 🔥 TRANSCRIBE SINGLE CHUNK
  async transcribe(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {

      const fullPath = path.resolve(filePath);
      const normalizedPath = fullPath.replace(/\\/g, '/');
      const outputDir = path.dirname(fullPath);

      const whisperProcess = spawn(
        this.PYTHON_PATH,
        [
          "-m",
          "whisper",
          normalizedPath,
          "--model", "small",        
          "--task", "translate",    //  KEEP (multilingual)
          "--fp16", "False",        // CPU optimization
          "--output_format", "txt",
          "--output_dir", outputDir,
        ]
      );

      whisperProcess.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error('Whisper failed'));
        }

        try {
          const txtPath = fullPath.replace(/\.[^/.]+$/, '.txt');

          const transcript = fs.readFileSync(txtPath, 'utf-8');

          fs.unlinkSync(txtPath); // cleanup

          resolve(transcript.trim());
        } catch (err) {
          reject(err);
        }
      });

      whisperProcess.on('error', reject);
    });
  }
}