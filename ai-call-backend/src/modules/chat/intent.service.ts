import { Injectable } from '@nestjs/common';
import Fuse from 'fuse.js';

@Injectable()
export class IntentService {
  private fuse: Fuse<string>;

  private summaryKeywords = [
    "summary",
    "summarize",
    "overview",
    "all calls",
    "show summaries",
    "call summary",
    "summaries",
    "brief",
    "explain all"
  ];

  constructor() {
    this.fuse = new Fuse(this.summaryKeywords, {
      threshold: 0.5, // balanced
      includeScore: true,
    });
  }

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ✅ safer fuzzy
  private fuzzyMatch(question: string): boolean {
    const cleaned = this.normalize(question);

    const result = this.fuse.search(cleaned);

    return result.length > 0;
  }

  // ✅ STRICT semantic (no substring traps)
  private semanticMatch(question: string): boolean {
    const q = this.normalize(question);
    const words = q.split(" ");

    const hasSummaryWord = words.some(w =>
      ["summary", "summarize", "overview", "brief"].includes(w)
    );

    const hasCallContext =
      q.includes("all calls") ||
      q.includes("all call") ||
      (words.includes("all") && words.includes("calls"));

    return hasSummaryWord || hasCallContext;
  }

  isSummaryQuery(question: string): boolean {
    return this.fuzzyMatch(question) || this.semanticMatch(question);
  }
}