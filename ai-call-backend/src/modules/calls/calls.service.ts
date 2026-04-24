import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Call, CallDocument } from './call.schema';
import { Model } from 'mongoose';

@Injectable()
export class CallsService {
  constructor(
    @InjectModel(Call.name) private callModel: Model<CallDocument>,
  ) { }

  async create(data: Partial<Call>) {
    const call = new this.callModel(data);
    return call.save();
  }

  async findAll() {
    return this.callModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return this.callModel.findById(id);
  }

  async updateStatus(id: string, status: string) {
    return this.callModel.findByIdAndUpdate(id, { status });
  }

  async updateTranscript(id: string, transcript: string) {
    return this.callModel.findByIdAndUpdate(id, {
      transcript,
      status: 'completed',
    });
  }
}
