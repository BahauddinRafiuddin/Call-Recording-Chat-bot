import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import { QUEUE_NAME } from '../queue/queue.constants';
import { TranscriptionService } from './transcription.service';
import { CallsService } from '../calls/calls.service';
import { ChunkingService } from '../chunking/chunking.service';
import { VectorService } from '../vector/vector.service';
import { LLMService } from '../llm/llm.service';
import * as fs from 'fs';
import pLimit from 'p-limit';

@Injectable()
export class TranscriptionProcessor implements OnModuleInit {
  constructor(
    private transcriptionService: TranscriptionService,
    private callsService: CallsService,
    private chunkingService: ChunkingService,
    private vectorService: VectorService,
    private llmService: LLMService
  ) {}

  onModuleInit() {
    const worker = new Worker(
      QUEUE_NAME,
      async (job) => {
        const { callId, filePath } = job.data;

        console.log(`
        ========================================
        🚀 START PROCESSING CALL: ${callId}
        📂 File: ${filePath}
        ========================================
                `);

        const pipelineStart = Date.now();

        try {
          // 1. Update status
          await this.callsService.updateStatus(callId, 'processing');

          const call = await this.callsService.findById(callId);

          // 2. Split audio
          const splitStart = Date.now();
          const segments = await this.transcriptionService.splitAudio(filePath);

          console.log(`✂️ Split into ${segments.length} chunks`);
          console.log(`⏱ Split time: ${((Date.now() - splitStart) / 1000).toFixed(2)}s`);

          // 3. Controlled parallel transcription
          const limit = pLimit(2); //  adjust (2–3 best for CPU)

          const transcribeStart = Date.now();

          const transcripts = await Promise.all(
            segments.map((seg, index) =>
              limit(async () => {
                const chunkStart = Date.now();

                console.log(`🎧 [${index + 1}/${segments.length}] Processing chunk`);

                const result = await this.transcriptionService.transcribe(seg);

                const chunkTime = ((Date.now() - chunkStart) / 1000).toFixed(2);

                console.log(`✅ Chunk ${index + 1} done in ${chunkTime}s`);

                return result;
              })
            )
          );

          const transcript = transcripts.join(" ");

          const transcribeTime = ((Date.now() - transcribeStart) / 1000).toFixed(2);
          console.log(`📝 Transcription completed in ${transcribeTime}s`);

          // 4. Cleanup temp chunks
          segments.forEach(f => {
            try {
              fs.unlinkSync(f);
            } catch (err) {
              console.warn("⚠️ Failed to delete chunk:", f);
            }
          });

          console.log("🧹 Temporary chunks cleaned");

          // 5. Chunking
          const chunkStart = Date.now();

          const chunks = this.chunkingService.splitText(
            transcript,
            callId.toString(),
            call!.userId
          );

          console.log(`📦 Created ${chunks.length} chunks`);
          console.log(`⏱ Chunking time: ${((Date.now() - chunkStart) / 1000).toFixed(2)}s`);

          // 6. Store embeddings
          const embedStart = Date.now();

          await this.vectorService.addChunks(chunks);

          console.log(`📊 Embeddings stored`);
          console.log(`⏱ Embedding time: ${((Date.now() - embedStart) / 1000).toFixed(2)}s`);

          // 7. Generate summary
          const summaryStart = Date.now();

          const topChunks = chunks.slice(0, 5);
          const combinedText = topChunks.map(c => c.content).join("\n");

          const summary = await this.llmService.generateResponse(`
          Summarize this call in 3-4 bullet points proper formate:

          ${combinedText}
                    `);

          await this.vectorService.addCallSummary(
            summary,
            callId.toString(),
            call!.userId
          );

          await this.callsService.updateCallSummary(callId, summary);

          console.log(`🧠 Summary generated`);
          console.log(`⏱ Summary time: ${((Date.now() - summaryStart) / 1000).toFixed(2)}s`);

          // 8. Save final data
          await this.callsService.updateTranscript(callId, transcript);
          await this.callsService.updateStatus(callId, 'completed');

          const totalTime = ((Date.now() - pipelineStart) / 1000).toFixed(2);

          console.log(`
          ========================================
          ✅ COMPLETED CALL: ${callId}
          ⏱ Total Time: ${totalTime}s
          ========================================
          `);

        } catch (error) {
          console.error(`❌ Error processing call ${callId}:`, error);
          await this.callsService.updateStatus(callId, 'failed');
          throw error;
        }
      },
      {
        connection: {
          host: 'localhost',
          port: 6379,
        },
        lockDuration: 10 * 60 * 1000,
        stalledInterval: 60 * 1000,
      }
    );

    worker.on('completed', (job) => {
      console.log(`🎉 Job completed: ${job.id}`);
    });

    worker.on('failed', (job, err) => {
      console.log(`💥 Job failed: ${job?.id}`, err);
    });
  }
}