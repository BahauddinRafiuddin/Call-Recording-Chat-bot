import { Module } from '@nestjs/common';
import { TranscriptionProcessor } from './transcription.processor';
import { TranscriptionService } from './transcription.service';
import { CallsModule } from '../calls/calls.module';

@Module({
  imports: [CallsModule],
  providers: [TranscriptionProcessor, TranscriptionService],
})
export class TranscriptionModule {}