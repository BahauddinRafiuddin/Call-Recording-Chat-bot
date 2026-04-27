import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './database/mongo.module';
import { CallsModule } from './modules/calls/calls.module';
import { UploadModule } from './modules/upload/upload.module';
import { QueueModule } from './modules/queue/queue.module';
import { TranscriptionModule } from './modules/transcription/transcription.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    MongoModule,
    CallsModule,
    UploadModule,
    QueueModule,
    TranscriptionModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
