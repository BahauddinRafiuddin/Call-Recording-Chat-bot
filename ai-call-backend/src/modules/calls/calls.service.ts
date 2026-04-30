import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Call, CallDocument } from './call.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { VectorService } from '../vector/vector.service';


@Injectable()
export class CallsService {
  constructor(
    @InjectModel(Call.name) private callModel: Model<CallDocument>,
    private vectorService: VectorService
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

  async deleteCall(callId: string, userId: string) {
    const call = await this.callModel.findById(callId);

    if (!call) {
      throw new Error('Call not found');
    }

    // Delete from Chroma
    await this.vectorService.deleteByCallId(callId, userId);

    // Delete file from disk
    if (fs.existsSync(call.filePath)) {
      fs.unlinkSync(call.filePath);
    }

    // Delete Mongo record
    await this.callModel.findByIdAndDelete(callId);

    return { message: 'Call deleted successfully' };
  }

  async findAllByUser(userId: string) {
    return this.callModel.find({
      userId,
      status: 'completed'
    }).sort({ createdAt: -1 });
  }

  async updateCallSummary(callId: string, summary: string) {
    return this.callModel.findByIdAndUpdate(callId, {
      shortSummary: summary
    });
  }

  async findByIds(ids: string[]) {
    return this.callModel.find({ _id: { $in: ids } });
  }
}
