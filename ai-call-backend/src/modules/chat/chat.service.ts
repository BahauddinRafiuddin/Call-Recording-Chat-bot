import { Injectable } from '@nestjs/common';
import { VectorService } from '../vector/vector.service';
import { LLMService } from '../llm/llm.service';
import { CallsService } from '../calls/calls.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly vectorService: VectorService,
    private readonly llmService: LLMService,
    private readonly callsService: CallsService
  ) { }

  async askQuestion(question: string, userId: string, callId?: string) {

    if (callId) {
      return this.handleSingleCall(question, userId, callId);
    }

    return this.handleMultiCall(question, userId);
  }

  async handleSingleCall(question: string, userId: string, callId: string) {
    const result = await this.vectorService.search(question, userId, callId);

    return this.generateAnswer(question, result);
  }

  async handleMultiCall(question: string, userId: string) {

    // 1. Get all calls
    const calls = await this.callsService.findAllByUser(userId);

    // 🔥 OPTIONAL OPTIMIZATION (later)
    // filter calls using summary

    const results = await Promise.all(
      calls.map(async (call) => {

        const result = await this.vectorService.search(
          question,
          userId,
          call._id.toString()
        );

        if (!result.documents.length) return null;

        const response = await this.generateAnswer(question, result);

        return {
          callId: call._id,
          fileName: call.fileName,
          answer: response.answer,
          confidence: response.confidence,
          sources: response.sources
        };
      })
    );

    return {
      type: "multi_call",
      results: results.filter(Boolean),
    };
  }

  private async generateAnswer(question: string, result: any) {
    const chunks = result.documents;
    const distances = result.distances;

    const context = chunks.join('\n');

    const prompt = `
    You are analyzing ONE call transcript.

    Rules:
    - Answer ONLY using the context
    - Give Reply In Proper Formating
    - Be clear and concise
    - If not found, say "Not found in transcript"

    Context:
    ${context}

    Question:
    ${question}
    `;

    const answer = await this.llmService.generateResponse(prompt);

    const avgDistance =
      distances.reduce((sum, d) => sum + d, 0) / distances.length;

    let confidence: "high" | "medium" | "low";

    if (avgDistance < 0.5) confidence = "high";
    else if (avgDistance < 0.9) confidence = "medium";
    else confidence = "low";

    return { answer, confidence, sources: chunks };
  }
}