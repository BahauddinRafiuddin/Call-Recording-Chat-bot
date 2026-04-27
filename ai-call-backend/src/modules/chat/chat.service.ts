import { Injectable } from '@nestjs/common';
import { VectorService } from '../vector/vector.service';
import { LLMService } from '../llm/llm.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly vectorService: VectorService,
    private readonly llmService: LLMService,
  ) { }

  async askQuestion(question: string, callId?: string) {
    const result = await this.vectorService.search(question, callId);
    const chunks = result.documents;
    const distances = result.distances;
    if (!chunks || chunks.length === 0) {
      return { answer: "No relevant information found.", sources: [], confidence: "low", };
    }

    const context = chunks.join('\n');

    const prompt = `
    You are analyzing a call transcript.

    Instructions:
    - Answer ONLY using the context
    - Give Reply In Proper Formating
    - Be clear and concise
    - Ask About Summary then summaries the available context
    - If not found, say "Not found in transcript"
    
    Context:
    ${context}

    Question:
    ${question}

    Answer:
    `;

    const answer = await this.llmService.generateResponse(prompt);
    const avgDistance =
      distances.reduce((sum, d) => sum + d, 0) / distances.length;

    let confidence: "high" | "medium" | "low";

    if (avgDistance < 0.5) confidence = "high";
    else if (avgDistance < 0.9) confidence = "medium";
    else confidence = "low";

    return { answer, sources: chunks, confidence, distances };
  }
}
