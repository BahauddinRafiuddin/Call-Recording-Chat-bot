import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import { QUEUE_NAME } from '../queue/queue.constants';
import { TranscriptionService } from './transcription.service';
import { CallsService } from '../calls/calls.service';

@Injectable()
export class TranscriptionProcessor implements OnModuleInit {
  constructor(
    private transcriptionService: TranscriptionService,
    private callsService: CallsService,
  ) {}

  onModuleInit() {
    const worker = new Worker(
      QUEUE_NAME,
      async (job) => {
        const { callId, filePath } = job.data;

        console.log('Processing job:', callId);

        try {
          // 1. Update status
          await this.callsService.updateStatus(callId, 'processing');

          // 2. Transcribe
          const transcript =
            await this.transcriptionService.transcribe(filePath);

          // 3. Save result
          await this.callsService.updateTranscript(callId, transcript);

          console.log('Transcription completed:', callId);
        } catch (error) {
          console.error('Error processing job:', error);

          await this.callsService.updateStatus(callId, 'failed');
        }
      },
      {
        connection: {
          host: 'localhost',
          port: 6379,
        },
      },
    );

    worker.on('completed', (job) => {
      console.log(`Job completed: ${job.id}`);
    });

    worker.on('failed', (job, err) => {
      console.log(`Job failed: ${job?.id}`, err);
    });
  }
}