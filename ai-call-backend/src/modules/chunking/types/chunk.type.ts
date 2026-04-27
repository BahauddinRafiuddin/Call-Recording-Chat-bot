export interface Chunk {
  content: string;
  chunkIndex: number;
  callId: string;
  startWord: number;
  endWord: number;
}