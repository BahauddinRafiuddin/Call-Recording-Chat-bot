import { Module } from '@nestjs/common';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Call, CallSchema } from './call.schema';
import { VectorModule } from '../vector/vector.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Call.name, schema: CallSchema }]),VectorModule],
  controllers: [CallsController],
  providers: [CallsService],
  exports:[CallsService]
})
export class CallsModule { }
