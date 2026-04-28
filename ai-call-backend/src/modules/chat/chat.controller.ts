import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AskQuestionDto } from './dto/ask-question.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post('ask')
  async askQuestion(@Headers('x-user-id') userId: string, @Body() dto: AskQuestionDto) {
    return this.chatService.askQuestion(dto.question, userId, dto.callId);
  }
}
