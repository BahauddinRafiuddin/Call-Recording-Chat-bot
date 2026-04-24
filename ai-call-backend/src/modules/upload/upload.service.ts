import { Injectable } from '@nestjs/common';
import { CallsService } from '../calls/calls.service';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class UploadService {
  constructor(
    private callsService: CallsService,
    private queueService: QueueService
  ) { }

  async handleUpload(file: Express.Multer.File) {
    const call = await this.callsService.create({
      fileName: file.originalname,
      filePath: `uploads/${file.filename}`,
      fileSize: file.size,
      fileType: file.mimetype,
      status: 'uploaded',
    });

    await this.queueService.addTranscriptionJob({
      callId: call._id,
      filePath: call.filePath
    })

    return call
  }
}
