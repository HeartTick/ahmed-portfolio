/**
 * Limits shared by the Ask Ahmed AI client component and route handler.
 * Safe to import from client code: contains no secrets.
 */

/** Maximum characters accepted for a single question. */
export const MAX_QUESTION_LENGTH = 500;

/** Maximum raw request body size in bytes (question + JSON overhead). */
export const MAX_REQUEST_BYTES = 4_096;

/** Public route path. */
export const ASK_AHMED_ENDPOINT = "/api/ask-ahmed";
