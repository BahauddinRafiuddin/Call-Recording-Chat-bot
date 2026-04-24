import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CallsModule } from '../calls/calls.module';

@Module({
  imports:[CallsModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
