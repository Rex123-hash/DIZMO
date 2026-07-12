import { demoSlackMessages } from "./fixtures.js";
import type { SearchResult } from "./schemas.js";

export interface SearchAdapter {
  search(query: string, limit?: number): Promise<SearchResult[]>;
}

export class LocalSearchAdapter implements SearchAdapter {
  constructor(private readonly messages: SearchResult[] = demoSlackMessages) {}

  async search(query: string, limit = 5): Promise<SearchResult[]> {
    const terms = normalize(query).split(" ").filter(Boolean);

    return this.messages
      .map((message) => ({
        ...message,
        relevance: scoreMessage(message.text, terms, message.relevance),
      }))
      .filter((message) => message.relevance > 0)
      .sort((left, right) => right.relevance - left.relevance)
      .slice(0, limit);
  }
}

function scoreMessage(text: string, terms: string[], baseRelevance: number): number {
  const normalized = normalize(text);
  const matches = terms.filter((term) => normalized.includes(term)).length;

  if (matches === 0) {
    return 0;
  }

  return Math.min(1, baseRelevance + matches * 0.04);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}
