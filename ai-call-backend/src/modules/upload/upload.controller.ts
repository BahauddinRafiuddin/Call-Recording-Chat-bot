import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../common/multer/multer.config';
import { audioFileFilter } from '../../common/multer/file-filter';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) { }
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      ...multerConfig,
      fileFilter: audioFileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.handleUpload(file);
  }
}
