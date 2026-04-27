import { Injectable } from '@nestjs/common';
import { Chunk } from './types/chunk.type';

@Injectable()
export class ChunkingService {
  private CHUNK_SIZE = 500;
  private OVERLAP = 100;

  splitText(text: string, callId: string): Chunk[] {
    const words = text.split(/\s+/);
    const chunks: Chunk[] = []; 

    let start = 0;
    let chunkIndex = 0;

    while (start < words.length) {
      const end = start + this.CHUNK_SIZE;

      const chunkWords = words.slice(start, end);
      const content = chunkWords.join(' ');

      chunks.push({
        content,
        chunkIndex,
        callId,
        startWord: start,
        endWord: end,
      });

      start += this.CHUNK_SIZE - this.OVERLAP;
      chunkIndex++;
    }

    return chunks;
  }
}