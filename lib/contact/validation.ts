/**
 * Contact-form normalization and validation, shared by the browser (helpful
 * feedback) and the route handler (authoritative check). Safe to import from
 * client code: contains no secrets.
 */

export const CONTACT_ENDPOINT = "/api/contact";
export const CONTACT_MAX_REQUEST_BYTES = 12_000;
/** Submissions faster than this after the first interaction are treated as automated. */
export const CONTACT_MIN_FILL_MS = 3_000;

export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  company: { max: 100 },
  message: { min: 10, max: 2_000 },
} as const;

export type ContactFields = { name: string; email: string; company: string; message: string };
export type ContactFieldErrors = Partial<Record<keyof ContactFields, string>>;

// Control characters except tab and newline.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Length in Unicode code points, matching Postgres char_length(). */
export function charLength(value: string): number {
  return [...value].length;
}

function singleLine(value: string): string {
  return value.replace(CONTROL_CHARS, "").replace(/\s+/g, " ").trim();
}

export function normalizeContact(input: ContactFields): ContactFields {
  return {
    name: singleLine(input.name),
    email: input.email.replace(/\s+/g, ""),
    company: singleLine(input.company),
    message: input.message
      .replace(/\r\n?/g, "\n")
      .replace(CONTROL_CHARS, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  };
}

/** Validates already-normalized fields. Returns human-readable messages per field. */
export function validateContact(fields: ContactFields): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const { name, email, company, message } = CONTACT_LIMITS;

  const nameLength = charLength(fields.name);
  if (nameLength === 0) errors.name = "Please enter your name.";
  else if (nameLength < name.min) errors.name = `Please enter at least ${name.min} characters.`;
  else if (nameLength > name.max) errors.name = `Please keep your name under ${name.max} characters.`;

  if (!fields.email) errors.email = "Please enter your email address.";
  else if (charLength(fields.email) > email.max || !EMAIL.test(fields.email) || fields.email.split("@")[0].length > 64)
    errors.email = "Please enter a valid email address.";

  if (charLength(fields.company) > company.max) errors.company = `Please keep this under ${company.max} characters.`;

  const messageLength = charLength(fields.message);
  if (messageLength === 0) errors.message = "Please write a message.";
  else if (messageLength < message.min) errors.message = `Please write at least ${message.min} characters.`;
  else if (messageLength > message.max) errors.message = `Please keep your message under ${message.max} characters.`;

  return errors;
}
