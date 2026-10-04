import "server-only";

import { ProviderError, type ChatRequest } from "@/lib/ai/types";

/**
 * Minimal streaming client for OpenAI-compatible chat completion APIs
 * (Groq, xAI, ...). Uses fetch + Server-Sent Events directly, so no SDK is
 * bundled.
 */

type Options = ChatRequest & {
  baseUrl: string;
  apiKey: string;
  model: string;
  /** Provider-specific request fields. */
  extraBody?: Record<string, unknown>;
  timeoutMs?: number;
};

export async function streamOpenAICompatible(opts: Options): Promise<AsyncIterable<string>> {
  const timeout = AbortSignal.timeout(opts.timeoutMs ?? 30_000);
  const signal = opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout;

  let res: Response;
  try {
    res = await fetch(`${opts.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: opts.model,
        messages: opts.messages,
        stream: true,
        temperature: opts.temperature,
        max_completion_tokens: opts.maxTokens,
        ...opts.extraBody,
      }),
      signal,
      cache: "no-store",
    });
  } catch (err) {
    throw new ProviderError("upstream", `Request failed: ${(err as Error).name}`);
  }

  if (!res.ok || !res.body) {
    // Drain the body for logs without ever echoing it to the client.
    const detail = await res.text().catch(() => "");
    if (res.status === 429) throw new ProviderError("rate_limited", "Upstream rate limit reached");
    if (res.status === 401 || res.status === 403)
      throw new ProviderError("unconfigured", `Upstream rejected credentials (${res.status})`);
    throw new ProviderError("upstream", `Upstream error ${res.status}: ${detail.slice(0, 200)}`);
  }

  return parseSse(res.body);
}

async function* parseSse(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return;
      buffer += decoder.decode(value, { stream: true });

      let newline: number;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line.startsWith("data:")) continue;

        const data = line.slice(5).trim();
        if (data === "[DONE]") return;

        let json: {
          choices?: { delta?: { content?: unknown } }[];
          error?: { message?: string };
        };
        try {
          json = JSON.parse(data);
        } catch {
          continue;
        }
        if (json.error) throw new ProviderError("upstream", json.error.message ?? "Stream error");

        // Only `content` is forwarded; reasoning fields are ignored by design.
        const delta = json.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta.length > 0) yield delta;
      }
    }
  } finally {
    reader.releaseLock();
  }
}
