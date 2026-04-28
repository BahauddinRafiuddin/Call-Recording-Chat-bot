import { Injectable } from '@nestjs/common';
import { CallsService } from '../calls/calls.service';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class UploadService {
  constructor(
    private callsService: CallsService,
    private queueService: QueueService
  ) { }

  async handleUpload(file: Express.Multer.File, userId: string) {

    const normalizeMimeType = (mime: string): string => {
      if (mime.includes('wav')) return 'audio/wav';
      if (mime.includes('mpeg')) return 'audio/mpeg';
      if (mime.includes('mp4')) return 'audio/mp4';
      if (mime.includes('ogg')) return 'audio/ogg';
      return mime;
    };
    const call = await this.callsService.create({
      fileName: file.originalname,
      filePath: `uploads/${file.filename}`,
      fileSize: file.size,
      fileType: normalizeMimeType(file.mimetype),
      status: 'uploaded',
      userId,
    });

    await this.queueService.addTranscriptionJob({
      callId: call._id,
      filePath: call.filePath
    })

    return call
  }
}
