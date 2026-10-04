"use client";

import { useId, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { contactFormCopy as copy } from "@/data/contact";
import {
  CONTACT_ENDPOINT,
  CONTACT_LIMITS,
  charLength,
  normalizeContact,
  validateContact,
  type ContactFieldErrors,
  type ContactFields,
} from "@/lib/contact/validation";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";
type FieldName = keyof ContactFields;

const EMPTY: ContactFields = { name: "", email: "", company: "", message: "" };
const FIELD_ORDER: FieldName[] = ["name", "email", "company", "message"];

const noopSubscribe = () => () => {};

/** False during server render and hydration, true once React controls the page. */
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function EmailLink({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className="font-medium text-fg underline decoration-white/30 underline-offset-4 hover:decoration-cyan">
      {email}
    </a>
  );
}

export function ContactForm({ email }: { email: string }) {
  const [values, setValues] = useState<ContactFields>(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState<{ text: string; withEmail: boolean } | null>(null);
  const startedAt = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const id = useId();
  // Until hydration, a submit would be a native form post that bypasses onSubmit.
  const hydrated = useHydrated();

  const fieldId = (name: FieldName) => `${id}-${name}`;
  const errorId = (name: FieldName) => `${id}-${name}-error`;

  function markStarted() {
    startedAt.current ??= Date.now();
  }

  function onChange(name: FieldName) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      markStarted();
      const next = { ...values, [name]: e.target.value };
      setValues(next);
      // Once a field has been visited, keep its feedback live while typing.
      if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validateContact(normalizeContact(next))[name] }));
    };
  }

  function onBlur(name: FieldName) {
    return () => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({ ...prev, [name]: validateContact(normalizeContact(values))[name] }));
    };
  }

  function focusFirstInvalid(fieldErrors: ContactFieldErrors) {
    const first = FIELD_ORDER.find((f) => fieldErrors[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(first))}`)?.focus();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const fields = normalizeContact(values);
    const fieldErrors = validateContact(fields);
    setTouched({ name: true, email: true, company: true, message: true });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setNotice({ text: copy.fixErrors, withEmail: false });
      setStatus("error");
      focusFirstInvalid(fieldErrors);
      return;
    }

    setStatus("submitting");
    setNotice(null);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          website: honeypot,
          elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; fields?: ContactFieldErrors } | null;

      if (res.ok && data?.ok) {
        // Clear everything the visitor typed once it has been delivered.
        setValues(EMPTY);
        setHoneypot("");
        setErrors({});
        setTouched({});
        startedAt.current = null;
        setStatus("success");
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }

      setStatus("error");
      if (data?.error === "invalid_fields" && data.fields) {
        setErrors(data.fields);
        setNotice({ text: copy.fixErrors, withEmail: false });
        focusFirstInvalid(data.fields);
      } else if (data?.error === "too_fast") {
        startedAt.current = Date.now() - 1_000;
        setNotice({ text: copy.tooFast, withEmail: false });
      } else if (data?.error === "limit") {
        setNotice({ text: copy.limit, withEmail: true });
      } else {
        setNotice({ text: copy.unavailable, withEmail: true });
      }
    } catch {
      setStatus("error");
      setNotice({ text: copy.unavailable, withEmail: true });
    }
  }

  function sendAnother() {
    setStatus("idle");
    setNotice(null);
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId("name"))}`)?.focus());
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rise rounded-2xl border border-cyan/25 bg-cyan/[0.04] p-6 text-left focus-visible:outline-offset-4"
      >
        <p className="flex items-center gap-2 text-lg font-semibold tracking-tight text-fg">
          <CheckCircle2 size={20} className="text-cyan" aria-hidden="true" />
          {copy.successTitle}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{copy.successBody}</p>
        <button type="button" onClick={sendAnother} className="btn btn-ghost mt-5 h-10 text-sm">
          {copy.sendAnother}
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";
  const messageLength = charLength(values.message);
  const inputBase =
    "w-full rounded-xl border bg-bg/60 px-3.5 py-2.5 text-[15px] text-fg placeholder:text-subtle transition-colors focus:border-cyan/50 disabled:opacity-60";

  const field = (name: FieldName, label: string, opts: { optional?: boolean; type?: string; autoComplete?: string; max: number }) => {
    const invalid = Boolean(touched[name] && errors[name]);
    return (
      <div>
        <label htmlFor={fieldId(name)} className="mb-1.5 flex items-baseline justify-between text-sm text-fg">
          <span>
            {label}
            {opts.optional ? <span className="ml-1.5 text-xs text-subtle">(optional)</span> : <span aria-hidden="true" className="ml-0.5 text-cyan">*</span>}
          </span>
        </label>
        <input
          id={fieldId(name)}
          name={name}
          type={opts.type ?? "text"}
          autoComplete={opts.autoComplete}
          value={values[name]}
          onChange={onChange(name)}
          onBlur={onBlur(name)}
          onFocus={markStarted}
          maxLength={opts.max}
          disabled={submitting}
          aria-required={!opts.optional}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId(name) : undefined}
          className={cn(inputBase, invalid ? "border-violet/70" : "border-line-strong")}
        />
        {invalid ? (
          <p id={errorId(name)} className="mt-1.5 text-xs text-violet">
            {errors[name]}
          </p>
        ) : null}
      </div>
    );
  };

  const messageInvalid = Boolean(touched.message && errors.message);

  return (
    // method="post": if a native submit ever happens, field values never end up in the URL.
    <form
      ref={formRef}
      method="post"
      onSubmit={onSubmit}
      noValidate
      className="relative text-left"
      aria-describedby={`${id}-privacy`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", "Name", { autoComplete: "name", max: CONTACT_LIMITS.name.max })}
        {field("email", "Email", { type: "email", autoComplete: "email", max: CONTACT_LIMITS.email.max })}
      </div>
      <div className="mt-4">{field("company", "Company", { optional: true, autoComplete: "organization", max: CONTACT_LIMITS.company.max })}</div>

      <div className="mt-4">
        <label htmlFor={fieldId("message")} className="mb-1.5 flex items-baseline justify-between text-sm text-fg">
          <span>
            Message<span aria-hidden="true" className="ml-0.5 text-cyan">*</span>
          </span>
          <span className={cn("font-mono text-xs", messageLength > CONTACT_LIMITS.message.max ? "text-violet" : "text-subtle")} aria-hidden="true">
            {messageLength}/{CONTACT_LIMITS.message.max}
          </span>
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={5}
          value={values.message}
          onChange={onChange("message")}
          onBlur={onBlur("message")}
          onFocus={markStarted}
          disabled={submitting}
          aria-required
          aria-invalid={messageInvalid}
          aria-describedby={messageInvalid ? errorId("message") : undefined}
          className={cn(inputBase, "min-h-32 resize-y", messageInvalid ? "border-violet/70" : "border-line-strong")}
        />
        {messageInvalid ? (
          <p id={errorId("message")} className="mt-1.5 text-xs text-violet">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div role="status" aria-live="polite" className="empty:hidden">
        {notice ? (
          <p className="mt-4 flex items-start gap-3 rounded-xl border border-line bg-white/[0.02] p-3.5 text-sm leading-relaxed text-muted">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-violet" aria-hidden="true" />
            <span>
              {notice.text}
              {notice.withEmail ? (
                <>
                  {" "}
                  <EmailLink email={email} />.
                </>
              ) : null}
            </span>
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${id}-privacy`} className="text-xs leading-relaxed text-subtle">
          {copy.privacy}
        </p>
        <button type="submit" disabled={submitting || !hydrated} className="btn btn-primary shrink-0 disabled:cursor-wait disabled:opacity-80">
          {submitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
          {submitting ? copy.submitting : copy.submit}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {submitting ? copy.submitting : ""}
      </p>
    </form>
  );
}
