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
    if (!chunks || chunks.length === 0) {
      return { answer: "No relevant information found.", sources: [], };
    }

    const context = chunks.join('\n');

    const prompt = `
    You are analyzing a call transcript.

    Instructions:
    - Answer ONLY using the context
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

    return { answer, sources: chunks };
  }
}
