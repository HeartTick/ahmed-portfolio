import "server-only";

import type { ChatProvider } from "@/lib/ai/types";
import { createGroqProvider } from "@/lib/ai/providers/groq";

/**
 * Provider selection. The route handler and UI only depend on the
 * `ChatProvider` interface, so switching from Groq to another
 * OpenAI-compatible provider (e.g. xAI) means adding a file in ./providers
 * and changing `getChatProvider()`; nothing else.
 */

/** Returns the configured provider, or null when no API key is set. */
export function getChatProvider(): ChatProvider | null {
  return createGroqProvider();
}

/** True when an API key is configured. Never exposes the key itself. */
export function isAssistantConfigured(): boolean {
  return getChatProvider() !== null;
}
