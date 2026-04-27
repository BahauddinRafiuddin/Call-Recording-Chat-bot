
import { IsOptional, IsString } from 'class-validator';

export class AskQuestionDto {
  @IsString()
  question!: string;

  @IsOptional()
  @IsString()
  callId?: string;
}