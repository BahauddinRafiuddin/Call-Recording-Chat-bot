import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import { QUEUE_NAME } from '../queue/queue.constants';
import { TranscriptionService } from './transcription.service';
import { CallsService } from '../calls/calls.service';
import { ChunkingService } from '../chunking/chunking.service';
import { VectorService } from '../vector/vector.service';

@Injectable()
export class TranscriptionProcessor implements OnModuleInit {
  constructor(
    private transcriptionService: TranscriptionService,
    private callsService: CallsService,
    private chunkingService: ChunkingService,
    private vectorService: VectorService,
  ) { }

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

          // 3. CHUNKING
          const chunks = this.chunkingService.splitText(
            transcript,
            callId.toString(),
          );

          // 4. VECTOR DB STORAGE
          await this.vectorService.addChunks(chunks);
          console.log('Chunks stored in Chroma');

          // 5. Save transcript + completed
          await this.callsService.updateTranscript(callId, transcript);
          await this.callsService.updateStatus(callId, 'completed');

          console.log('Transcription + embedding completed:', callId);
        } catch (error) {
          console.error('Error processing job:', error);
          await this.callsService.updateStatus(callId, 'failed');
          throw error;
        }
      },
      {
        connection: {
          host: 'localhost',
          port: 6379,
        },
        lockDuration: 10 * 60 * 1000, // 10 minutes
        stalledInterval: 60 * 1000,   // check every 1 min
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