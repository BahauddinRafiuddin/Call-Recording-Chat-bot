import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChromaClient, Collection } from 'chromadb';
import { Chunk } from '../chunking/types/chunk.type';

@Injectable()
export class VectorService implements OnModuleInit {
  private client: ChromaClient;
  private collection!: Collection;

  constructor() {
    this.client = new ChromaClient({
      path: 'http://localhost:8000',
    });
  }

  async onModuleInit() {
    this.collection = await this.client.getOrCreateCollection({
      name: 'call_transcripts',
    });
  }

  async addChunks(chunks: Chunk[]) {
    if (!chunks.length) return;

    const callId = chunks[0].callId;

    if (!chunks.every(c => c.callId === callId)) {
      throw new Error('Chunks contain multiple callIds');
    }

    // Remove old data
    await this.collection.delete({
      where: { callId },
    });

    const ids = chunks.map(c => `${c.callId}_${c.chunkIndex}`);
    const documents = chunks.map(c => c.content);

    const metadatas = chunks.map(c => ({
      callId: c.callId,
      chunkIndex: c.chunkIndex,
      startWord: c.startWord,
      endWord: c.endWord,
    }));

    await this.collection.add({
      ids,
      documents,
      metadatas,
    });
  }

  async search(query: string, callId?: string) {
    const results = await this.collection.query({
      queryTexts: [query],
      nResults: 5,
      where: callId ? { callId } : undefined,
    });

    return {
      documents: results.documents[0],
      metadatas: results.metadatas[0],
    };
  }

  async deleteByCallId(callId: string) {
    try {
      await this.collection.delete({
        where: { callId },
      });
    } catch (error) {
      console.error('Vector delete failed', error);
    }
  }

}