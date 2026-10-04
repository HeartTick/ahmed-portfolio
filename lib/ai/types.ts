/** Provider-agnostic types shared by the AI layer (server-side). */

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatRequest = {
  messages: ChatMessage[];
  maxTokens: number;
  temperature: number;
  signal?: AbortSignal;
};

export interface ChatProvider {
  readonly id: string;
  readonly model: string;
  /** Resolves once the upstream accepted the request; yields text deltas. */
  streamChat(request: ChatRequest): Promise<AsyncIterable<string>>;
}

export type ProviderErrorKind = "unconfigured" | "rate_limited" | "upstream";

export class ProviderError extends Error {
  constructor(
    readonly kind: ProviderErrorKind,
    message: string,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
