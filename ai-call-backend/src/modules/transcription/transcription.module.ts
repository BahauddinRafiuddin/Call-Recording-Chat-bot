import { Module } from '@nestjs/common';
import { TranscriptionProcessor } from './transcription.processor';
import { TranscriptionService } from './transcription.service';
import { CallsModule } from '../calls/calls.module';
import { VectorModule } from '../vector/vector.module';
import { ChunkingModule } from '../chunking/chunking.module';
import { LLMModule } from '../llm/llm.module';

@Module({
  imports: [CallsModule,VectorModule,ChunkingModule,LLMModule],
  providers: [TranscriptionProcessor, TranscriptionService],
})
export class TranscriptionModule {}