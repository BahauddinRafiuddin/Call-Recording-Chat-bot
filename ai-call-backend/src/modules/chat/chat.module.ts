import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { VectorModule } from '../vector/vector.module';
import { LLMService } from '../llm/llm.service';
import { CallsModule } from '../calls/calls.module';
import { IntentService } from './intent.service';

@Module({
  imports:[VectorModule,CallsModule],
  controllers: [ChatController],
  providers: [ChatService,LLMService,IntentService]
})
export class ChatModule {}
