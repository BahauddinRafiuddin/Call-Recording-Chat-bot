export interface Chunk {
  content: string;
  chunkIndex: number;
  callId: string;
  userId: string;
  startWord: number;
  endWord: number;
}