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
      userId: c.userId,
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

  // async search(query: string, callId?: string) {
  //   const results = await this.collection.query({
  //     queryTexts: [query],
  //     nResults: 5,
  //     where: callId ? { callId } : undefined,
  //   });

  //   return {
  //     documents: results.documents[0],
  //     metadatas: results.metadatas[0],
  //   };
  // }

  async deleteByCallId(callId: string, userId: string) {
    try {
      await this.collection.delete({
        where: {
          $and: [
            { callId: callId },
            { userId: userId }
          ]
        }
      });
    } catch (error) {
      console.error('Vector delete failed', error);
    }
  }

  async search(query: string, userId: string, callId?: string) {
    const queryType = this.classifyQuery(query);
    const nResults = this.getResultCount(queryType);

    const results = await this.collection.query({
      queryTexts: [query],
      nResults,
      where: callId
        ? {
          $and: [
            { callId: callId },
            { userId: userId }
          ]
        }
        : {
          userId: userId
        }
    });

    const documents = results?.documents?.[0] ?? [];
    const metadatas = results?.metadatas?.[0] ?? [];
    const distances = results?.distances?.[0] ?? [];

    const threshold = this.getDistanceThreshold(queryType);

    const filtered = documents.reduce((acc, doc, i) => {
      const distance = distances[i];

      if (
        doc &&
        distance !== undefined &&
        distance !== null &&
        distance <= threshold
      ) {
        acc.push({
          doc,
          metadata: metadatas[i],
          distance,
        });
      }

      return acc;
    }, [] as { doc: string; metadata: any; distance: number }[]);

    // fallback
    const final =
      filtered.length > 0
        ? filtered
        : [{
          doc: documents[0] ?? "",
          metadata: metadatas[0],
          distance: distances[0] ?? 1,
        }];

    return {
      documents: final.map((f) => f.doc),
      metadatas: final.map((f) => f.metadata),
      distances: final.map((f) => f.distance), // 🔥 IMPORTANT
    };
  }

  // Classify what kind of query this is
  private classifyQuery(query: string): "factual" | "summary" | "analytical" {
    const q = query.toLowerCase();

    const factualKeywords = [
      "what is", "who is", "who are", "what are", "name",
      "when", "where", "how many", "how much", "which",
      "author", "title", "date", "number", "age", "price"
    ];

    const summaryKeywords = [
      "summarize", "summary", "overview", "explain",
      "describe", "tell me about", "what happened",
      "key points", "main points", "highlights"
    ];

    if (factualKeywords.some((k) => q.includes(k))) return "factual";
    if (summaryKeywords.some((k) => q.includes(k))) return "summary";
    return "analytical";
  }

  // How many chunks to fetch per query type
  private getResultCount(queryType: "factual" | "summary" | "analytical"): number {
    switch (queryType) {
      case "factual": return 2;  // simple fact — need very little context
      case "summary": return 6;  // need broad coverage
      case "analytical": return 4; // need some context but not everything
    }
  }

  // Distance threshold — lower = stricter match (ChromaDB uses L2 distance)
  private getDistanceThreshold(queryType: "factual" | "summary" | "analytical"): number {
    switch (queryType) {
      case "factual": return 0.7;  // strict — only very relevant chunks
      case "summary": return 1.2;  // loose — want broad coverage
      case "analytical": return 0.9;  // medium
    }
  }

}