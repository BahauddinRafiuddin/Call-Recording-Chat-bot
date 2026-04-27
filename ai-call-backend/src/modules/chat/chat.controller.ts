import { Body, Controller, Post } from '@nestjs/common';
import { AskQuestionDto } from './dto/ask-question.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
   constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  async askQuestion(@Body() dto: AskQuestionDto) {
    return this.chatService.askQuestion(dto.question, dto.callId);
  }
}
