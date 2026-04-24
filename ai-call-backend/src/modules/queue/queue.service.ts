import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_NAME } from './queue.constants';

@Injectable()
export class QueueService implements OnModuleInit {
  private queue!: Queue;
  onModuleInit() {
    this.queue = new Queue(QUEUE_NAME, {
      connection: {
        host: 'localhost',
        port: 6379
      },
    })
  }

  async addTranscriptionJob(data: any) {
    await this.queue.add('transcribe', data), {
      attempts: 3, // retry if fails
      removeOnComplete: true,
    }
  }
}
