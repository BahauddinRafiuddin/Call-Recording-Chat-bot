import { Module } from '@nestjs/common';
import { TranscriptionProcessor } from './transcription.processor';
import { TranscriptionService } from './transcription.service';
import { CallsModule } from '../calls/calls.module';
import { VectorModule } from '../vector/vector.module';
import { ChunkingModule } from '../chunking/chunking.module';

@Module({
  imports: [CallsModule,VectorModule,ChunkingModule],
  providers: [TranscriptionProcessor, TranscriptionService],
})
export class TranscriptionModule {}