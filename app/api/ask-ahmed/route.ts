import { MAX_QUESTION_LENGTH, MAX_REQUEST_BYTES } from "@/lib/ai/limits";
import { getChatProvider } from "@/lib/ai/provider";
import { takeRateLimitToken } from "@/lib/ai/rate-limit";
import { isClearlyOffTopic } from "@/lib/ai/scope";
import { buildSystemPrompt, OUT_OF_SCOPE_REPLY } from "@/lib/ai/system-prompt";
import { ProviderError } from "@/lib/ai/types";

/**
 * POST /api/ask-ahmed
 * Body: { "question": string }
 * Success: 200 text/plain stream of the answer.
 * Failure: JSON { error: <code> } with an appropriate status.
 *
 * Stateless: nothing is stored and no visitor identifiers are logged.
 */

export const runtime = "nodejs";
export const maxDuration = 30;

/** Includes hidden reasoning tokens for reasoning models; visible answers stay short via the prompt. */
const MAX_ANSWER_TOKENS = 1_600;

const noStore = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

type ErrorCode =
  | "invalid_request"
  | "question_required"
  | "question_too_long"
  | "forbidden"
  | "busy"
  | "unavailable";

function errorResponse(code: ErrorCode, status: number) {
  return Response.json({ error: code }, { status, headers: noStore });
}

function textResponse(body: ReadableStream<Uint8Array> | string, extra: Record<string, string> = {}) {
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8", ...noStore, ...extra },
  });
}

/** Rejects requests from other sites so the endpoint isn't a free public proxy. */
function isSameOrigin(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function normalizeQuestion(raw: string): string {
  return raw
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return errorResponse("forbidden", 403);

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return errorResponse("invalid_request", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_REQUEST_BYTES) return errorResponse("question_too_long", 413);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return errorResponse("invalid_request", 400);
  }
  if (new TextEncoder().encode(raw).byteLength > MAX_REQUEST_BYTES) {
    return errorResponse("question_too_long", 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return errorResponse("invalid_request", 400);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return errorResponse("invalid_request", 400);
  }
  const rawQuestion = (body as { question?: unknown }).question;
  if (typeof rawQuestion !== "string") return errorResponse("question_required", 400);

  const question = normalizeQuestion(rawQuestion);
  if (!question) return errorResponse("question_required", 400);
  if (question.length > MAX_QUESTION_LENGTH) return errorResponse("question_too_long", 400);

  // Obvious general-purpose requests never reach the model.
  if (isClearlyOffTopic(question)) {
    return textResponse(OUT_OF_SCOPE_REPLY, { "X-Ask-Ahmed-Scope": "out-of-scope" });
  }

  const provider = getChatProvider();
  if (!provider) return errorResponse("unavailable", 503);

  if (!takeRateLimitToken()) return errorResponse("busy", 429);

  let deltas: AsyncIterable<string>;
  try {
    deltas = await provider.streamChat({
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: question },
      ],
      maxTokens: MAX_ANSWER_TOKENS,
      // Deterministic: grounding beats variety for a factual assistant.
      temperature: 0,
      signal: request.signal,
    });
  } catch (err) {
    const kind = err instanceof ProviderError ? err.kind : "upstream";
    console.error(`[ask-ahmed] ${provider.id} request failed (${kind}):`, (err as Error).message);
    return kind === "rate_limited" ? errorResponse("busy", 429) : errorResponse("unavailable", 503);
  }

  const encoder = new TextEncoder();
  const iterator = deltas[Symbol.asyncIterator]();
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();
        if (done) controller.close();
        else controller.enqueue(encoder.encode(value));
      } catch (err) {
        console.error(`[ask-ahmed] stream interrupted:`, (err as Error).message);
        controller.error(err);
      }
    },
    async cancel() {
      await iterator.return?.();
    },
  });

  return textResponse(stream);
}

export function GET() {
  return Response.json({ error: "method_not_allowed" }, { status: 405, headers: { Allow: "POST", ...noStore } });
}
