import "server-only";

import type { ChatProvider } from "@/lib/ai/types";
import { streamOpenAICompatible } from "@/lib/ai/providers/openai-compatible";

/** Used when GROQ_MODEL is not set. Override it without code changes. */
export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

export function createGroqProvider(): ChatProvider | null {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;

  // GPT-OSS models reason before answering. "medium" gives the model room to
  // run the prompt's sentence-by-sentence grounding check: in live tests it made
  // fewer unsupported inferences than "low", and "high" was not better.
  // Reasoning stays out of the response.
  // Other models reject these fields, so send them only here.
  const extraBody = model.startsWith("openai/gpt-oss")
    ? { include_reasoning: false, reasoning_effort: "medium" }
    : undefined;

  return {
    id: "groq",
    model,
    streamChat: (request) =>
      streamOpenAICompatible({ ...request, baseUrl: GROQ_BASE_URL, apiKey, model, extraBody }),
  };
}
