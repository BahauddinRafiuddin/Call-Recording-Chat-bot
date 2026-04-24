import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CallDocument = Call & Document;

@Schema({ timestamps: true })
export class Call {
  @Prop({ required: true })
  fileName!: string;

  @Prop({ required: true })
  filePath!: string;

  @Prop({ default: 0 })
  fileSize!: number;

  @Prop({
    enum: ['uploaded', 'processing', 'completed', 'failed'],
    default: 'uploaded',
  })
  status!: string;

  @Prop({ default: null })
  transcript!: string;

  @Prop({ default: null })
  duration!: number;

  @Prop({
    enum: ['audio/mpeg', 'audio/wav', 'audio/mp4'],
  })
  fileType!: string;
}

export const CallSchema = SchemaFactory.createForClass(Call);