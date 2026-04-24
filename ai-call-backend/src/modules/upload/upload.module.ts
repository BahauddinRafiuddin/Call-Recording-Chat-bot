import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CallsModule } from '../calls/calls.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports:[CallsModule,QueueModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
