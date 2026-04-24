import { Injectable } from '@nestjs/common';
import { CallsService } from '../calls/calls.service';
import { Express } from 'express';

@Injectable()
export class UploadService {
  constructor(private callsService: CallsService) { }
  async handleUpload(file: Express.Multer.File) {
    return this.callsService.create({
      fileName: file.originalname,
      filePath: `uploads/${file.filename}`,
      fileSize: file.size,
      fileType: file.mimetype,
      status: 'uploaded',
    });
  }
}
