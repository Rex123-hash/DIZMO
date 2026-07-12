import type { SearchAdapter, SearchResult } from "@dizmo/core";

interface SlackHistoryResponse {
  ok: boolean;
  error?: string;
  messages?: Array<{
    user?: string;
    username?: string;
    bot_id?: string;
    text?: string;
    ts?: string;
  }>;
}

export class SlackChannelSearchAdapter implements SearchAdapter {
  constructor(
    private readonly token: string,
    private readonly channelId: string,
  ) {}

  async search(query: string, limit = 5): Promise<SearchResult[]> {
    const url = new URL("https://slack.com/api/conversations.history");
    url.searchParams.set("channel", this.channelId);
    url.searchParams.set("limit", "100");

    const response = await fetch(url, {
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Slack history request failed: ${response.status}`);
    }

    const body = (await response.json()) as SlackHistoryResponse;

    if (!body.ok) {
      throw new Error(`Slack history request failed: ${body.error ?? "unknown_error"}`);
    }

    const terms = normalize(query).split(" ").filter(Boolean);

    return (body.messages ?? [])
      .filter((message) => message.text)
      .map((message) => {
        const text = message.text ?? "";
        const relevance = score(text, terms);
        return {
          id: message.ts ?? text.slice(0, 24),
          channel: this.channelId,
          author: message.username ?? message.user ?? message.bot_id ?? "unknown",
          text,
          createdAt: timestampToDate(message.ts),
          relevance,
        };
      })
      .filter((message) => message.relevance > 0)
      .sort((left, right) => right.relevance - left.relevance)
      .slice(0, limit);
  }
}

function score(text: string, terms: string[]): number {
  const normalized = normalize(text);
  const matches = terms.filter((term) => normalized.includes(term)).length;
  return matches === 0 ? 0 : Math.min(1, 0.55 + matches * 0.09);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function timestampToDate(ts?: string): string {
  const seconds = Number(ts?.split(".")[0]);

  if (!Number.isFinite(seconds)) {
    return new Date().toISOString();
  }

  return new Date(seconds * 1000).toISOString();
}
