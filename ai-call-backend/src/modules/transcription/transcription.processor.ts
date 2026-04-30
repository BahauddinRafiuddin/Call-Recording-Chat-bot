import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import { QUEUE_NAME } from '../queue/queue.constants';
import { TranscriptionService } from './transcription.service';
import { CallsService } from '../calls/calls.service';
import { ChunkingService } from '../chunking/chunking.service';
import { VectorService } from '../vector/vector.service';
import { LLMService } from '../llm/llm.service';
import * as fs from 'fs';

@Injectable()
export class TranscriptionProcessor implements OnModuleInit {
  constructor(
    private transcriptionService: TranscriptionService,
    private callsService: CallsService,
    private chunkingService: ChunkingService,
    private vectorService: VectorService,
    private llmService: LLMService
  ) { }

  onModuleInit() {
    const worker = new Worker(
      QUEUE_NAME,
      async (job) => {
        const { callId, filePath } = job.data;

        console.log('Processing job:', callId);

        try {
          await this.callsService.updateStatus(callId, 'processing');

          const call = await this.callsService.findById(callId);

          // 1. SPLIT AUDIO
          const segments = await this.transcriptionService.splitAudio(filePath);

          console.log("Segments:", segments.length);

          // 2. PARALLEL TRANSCRIPTION
          const transcripts = await Promise.all(
            segments.map(seg => this.transcriptionService.transcribe(seg))
          );

          const transcript = transcripts.join(" ");

          // CLEAN TEMP FILES
          segments.forEach(f => fs.unlinkSync(f));

          // 3. CHUNKING
          const chunks = this.chunkingService.splitText(
            transcript,
            callId.toString(),
            call!.userId
          );

          // 4. STORE EMBEDDINGS FIRST
          await this.vectorService.addChunks(chunks);

          // 5. SUMMARY
          const topChunks = chunks.slice(0, 5);
          const combinedText = topChunks.map(c => c.content).join("\n");

          const summary = await this.llmService.generateResponse(`
          Summarize this call in 3-4 bullet points:

          ${combinedText}
          `);

          await this.vectorService.addCallSummary(
            summary,
            callId.toString(),
            call!.userId
          );

          await this.callsService.updateCallSummary(callId, summary);

          // 6. SAVE FINAL DATA
          await this.callsService.updateTranscript(callId, transcript);
          await this.callsService.updateStatus(callId, 'completed');

          console.log('Completed:', callId);

        } catch (error) {
          console.error('Error:', error);
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