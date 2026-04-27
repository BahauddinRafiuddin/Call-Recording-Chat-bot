import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class TranscriptionService {
  async transcribe(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      //  Absolute path
      const fullPath = path.resolve(process.cwd(), filePath);

      //  Normalize for Python
      const normalizedPath = fullPath.replace(/\\/g, '/');

      console.log('FILE PATH:', normalizedPath);

      //  Output directory (same as file)
      const outputDir = path.dirname(fullPath);

      const whisperProcess = spawn(
        "C:\\Users\\Rafiuddin\\AppData\\Local\\Programs\\Python\\Python313\\python.exe",
        [
          "-m",
          "whisper",
          normalizedPath,
          "--model",
          "small",
          "--task",
          "translate",
          "--output_format",
          "txt",
          "--output_dir",
          outputDir,
        ],
        {
          cwd: process.cwd(),
          env: {
            ...process.env,
            PYTHONIOENCODING: "utf-8",
          },
        }
      );

      //  Debug logs (optional but useful)
      whisperProcess.stdout.on('data', (data) => {
        console.log('stdout:', data.toString());
      });

      whisperProcess.stderr.on('data', (data) => {
        console.warn('stderr:', data.toString());
      });

      whisperProcess.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error('Whisper process failed'));
        }

        try {
          //  Build .txt path
          const txtPath = fullPath.replace(/\.[^/.]+$/, '.txt');

          console.log('Reading transcript from:', txtPath);

          //  Read transcript
          const transcript = fs.readFileSync(txtPath, 'utf-8');

          //  Cleanup (optional but recommended)
          if (fs.existsSync(txtPath)) {
            fs.unlinkSync(txtPath);
          }

          resolve(transcript.trim());
        } catch (error) {
          reject(error);
        }
      });

      whisperProcess.on('error', (err) => {
        reject(err);
      });
    });
  }
}