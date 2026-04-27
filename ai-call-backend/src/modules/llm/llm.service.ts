import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class LLMService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct', 
        messages: [
          {
            role: 'system',
            content: `
            You are an AI assistant that answers questions based ONLY on provided transcript context.

            Rules:
            - Do NOT make up answers
            - If answer is not found, say: "Not found in transcript"
            - Keep answers short and clear
            `,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq Error:', error);
      return 'Error generating response';
    }
  }
}