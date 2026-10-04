import "server-only";

/**
 * Cheap deterministic pre-filter for blatantly off-topic requests, so they
 * never reach the model. Deliberately narrow: anything that references
 * Ahmed or his portfolio passes through, and the system prompt handles the
 * remaining scope decisions.
 */

const PORTFOLIO_REFERENCE =
  /\b(ahmed|patan|he|his|him|portfolio|r[eé]sum[eé]|cv|experience|projectxpert|tu dresden|dresden|internship|project|skills?|education|degree)\b/i;

const OFF_TOPIC_PATTERNS: RegExp[] = [
  // Doing the visitor's own work.
  /\b(write|draft|do|complete|solve|finish)\b.*\b(assignment|homework|essay|thesis|exam|coursework|poem|story|cover letter|dissertation)\b/i,
  /\b(my|our)\s+(assignment|homework|essay|thesis|exam|coursework|dissertation)\b/i,
  // General code generation.
  /\b(generate|write|build|create|code|make)\b.*\b(bot|script|program|app|application|website|function|code|algorithm)\b/i,
  // Politics.
  /\b(vote|voting|election|elections|political party|democrats?|republicans?|left[- ]wing|right[- ]wing)\b/i,
];

export function isClearlyOffTopic(question: string): boolean {
  if (PORTFOLIO_REFERENCE.test(question)) return false;
  return OFF_TOPIC_PATTERNS.some((re) => re.test(question));
}
