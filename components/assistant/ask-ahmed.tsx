"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AlertCircle, ArrowUp, CornerDownLeft, RotateCcw, Sparkles, Square } from "lucide-react";
import { assistantCopy, suggestedQuestions } from "@/data/assistant";
import { ASK_AHMED_ENDPOINT, MAX_QUESTION_LENGTH } from "@/lib/ai/limits";
import { AnswerText } from "@/components/assistant/answer-text";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "streaming" | "done" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  question_required: "Please type a question first.",
  question_too_long: `Please keep questions under ${MAX_QUESTION_LENGTH} characters.`,
  busy: "The assistant is getting a lot of questions right now. Please try again in a minute.",
  unavailable: assistantCopy.unavailable,
  interrupted: "The answer was interrupted. Please try asking again.",
  session_limit: assistantCopy.sessionLimit,
  global_limit: assistantCopy.globalLimit,
};

/** Show the remaining-questions hint only when it's useful. */
const REMAINING_HINT_THRESHOLD = 2;

/** Errors whose message is safe and friendly enough to show as-is. */
class AskError extends Error {}

export function AskAhmed({ available }: { available: boolean }) {
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [questionsLeft, setQuestionsLeft] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputId = useId();
  const hintId = useId();

  const busy = status === "loading" || status === "streaming";
  const canAsk = available && !limitReached;

  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(raw: string) {
    const q = raw.trim();
    if (!q || busy || !canAsk) return;
    if (q.length > MAX_QUESTION_LENGTH) {
      setError(ERROR_MESSAGES.question_too_long);
      setStatus("error");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setQuestion(q);
    setAnswer("");
    setError(null);
    setStatus("loading");
    setInput("");

    let received = "";
    try {
      const res = await fetch(ASK_AHMED_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        if (data?.error === "session_limit" || data?.error === "global_limit") setLimitReached(true);
        throw new AskError(ERROR_MESSAGES[data?.error ?? ""] ?? assistantCopy.unavailable);
      }

      const remainingHeader = res.headers.get("X-Ask-Ahmed-Remaining");
      setQuestionsLeft(remainingHeader === null ? null : Number(remainingHeader));

      setStatus("streaming");
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        received += value;
        setAnswer(received);
      }
      if (!received.trim()) throw new AskError(assistantCopy.unavailable);
      setStatus("done");
    } catch (err) {
      if (controller.signal.aborted) {
        setStatus(received ? "done" : "idle");
        return;
      }
      // Raw network/stream errors (e.g. "network error") are replaced with friendly copy.
      setError(
        err instanceof AskError
          ? err.message
          : received
            ? ERROR_MESSAGES.interrupted
            : assistantCopy.unavailable,
      );
      setStatus("error");
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void ask(input);
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  function reset() {
    abortRef.current?.abort();
    setQuestion(null);
    setAnswer("");
    setError(null);
    setStatus("idle");
    inputRef.current?.focus();
  }

  const remaining = suggestedQuestions.filter((s) => s !== question);
  const showSuggestions = canAsk && !busy && status !== "error";
  const remainingHint =
    !limitReached && !busy && questionsLeft !== null && questionsLeft <= REMAINING_HINT_THRESHOLD
      ? assistantCopy.remaining(questionsLeft)
      : null;
  const statusText =
    status === "loading"
      ? "Thinking…"
      : status === "streaming"
        ? "Writing answer…"
        : status === "done"
          ? "Answer ready."
          : "";

  return (
    <div className="card overflow-hidden">
      {/* header strip */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <span className="flex items-center gap-2 font-mono text-[11px] tracking-wide whitespace-nowrap text-muted">
          <Sparkles size={13} className="text-violet" aria-hidden="true" />
          ask-ahmed / assistant
        </span>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap",
            available ? "border-cyan/25 text-cyan" : "border-line text-subtle",
          )}
        >
          <span
            aria-hidden="true"
            className={cn("size-1.5 rounded-full", available ? "pulse-soft bg-cyan" : "bg-subtle")}
          />
          {available ? (
            <>
              Grounded<span className="hidden sm:inline"> in portfolio data</span>
            </>
          ) : (
            "Offline"
          )}
        </span>
      </div>

      {/* conversation area */}
      <div className="min-h-[15rem] px-4 py-5 sm:px-6 sm:py-6">
        {!available ? (
          <p role="status" className="flex items-start gap-3 rounded-xl border border-line bg-white/[0.02] p-4 text-sm leading-relaxed text-muted">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-blue" aria-hidden="true" />
            {assistantCopy.unavailable}
          </p>
        ) : null}

        {question ? (
          <div className="rise">
            <p className="flex gap-2 font-mono text-[13px] leading-relaxed text-fg">
              <span aria-hidden="true" className="text-cyan">›</span>
              <span>
                <span className="sr-only">Your question: </span>
                {question}
              </span>
            </p>

            <div
              aria-live="polite"
              aria-busy={busy}
              className="mt-4 space-y-3 border-l border-line pl-4 text-[15px] leading-relaxed text-muted text-pretty"
            >
              {status === "loading" ? (
                <p className="flex items-center gap-2 text-sm text-subtle">
                  <span className="flex gap-1" aria-hidden="true">
                    <span className="pulse-soft size-1.5 rounded-full bg-cyan" />
                    <span className="pulse-soft size-1.5 rounded-full bg-blue [animation-delay:200ms]" />
                    <span className="pulse-soft size-1.5 rounded-full bg-violet [animation-delay:400ms]" />
                  </span>
                  Searching the portfolio…
                </p>
              ) : null}
              {answer ? <AnswerText text={answer} /> : null}
              {status === "streaming" ? (
                <span aria-hidden="true" className="caret inline-block h-4 w-[2px] translate-y-0.5 bg-cyan" />
              ) : null}
            </div>
          </div>
        ) : null}

        {error ? (
          <p role="alert" className="mt-4 flex items-start gap-3 rounded-xl border border-line bg-white/[0.02] p-4 text-sm leading-relaxed text-muted">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-violet" aria-hidden="true" />
            {error}
          </p>
        ) : null}

        {showSuggestions ? (
          <div className={question ? "mt-6" : undefined}>
            <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">
              {question ? "Ask something else" : "Try asking"}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {(question ? remaining.slice(0, 3) : suggestedQuestions).map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => void ask(s)}
                    className="rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-left text-[13px] leading-snug text-muted transition-colors hover:border-cyan/40 hover:text-fg"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="sr-only" role="status">
          {statusText}
        </p>
      </div>

      {/* input */}
      <form onSubmit={onSubmit} className="border-t border-line bg-white/[0.015] px-4 py-4 sm:px-5">
        <label htmlFor={inputId} className="sr-only">
          Ask a question about Ahmed&apos;s experience, projects, skills or education
        </label>
        <div className="flex items-end gap-2 rounded-xl border border-line-strong bg-bg/60 p-2 transition-colors focus-within:border-cyan/50">
          <textarea
            id={inputId}
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={!canAsk}
            maxLength={MAX_QUESTION_LENGTH}
            aria-describedby={hintId}
            placeholder={
              !available ? "Assistant unavailable" : limitReached ? "Daily limit reached" : "Ask about Ahmed's experience, projects or skills…"
            }
            className="max-h-36 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] text-fg placeholder:text-subtle focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed [field-sizing:content]"
          />
          {busy ? (
            <button type="button" onClick={stop} className="icon-btn size-10 shrink-0" aria-label="Stop generating">
              <Square size={14} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canAsk || !input.trim()}
              className="grid size-10 shrink-0 place-items-center rounded-lg bg-fg text-bg transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Ask"
            >
              <ArrowUp size={17} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-subtle">
          <p id={hintId} className={cn("items-center gap-1.5", canAsk ? "hidden sm:flex" : "hidden")}>
            <CornerDownLeft size={12} aria-hidden="true" />
            Enter to send · Shift+Enter for a new line
          </p>
          <div className="ml-auto flex items-center gap-3">
            {remainingHint ? <span className="font-mono">{remainingHint}</span> : null}
            {input.length > MAX_QUESTION_LENGTH * 0.8 ? (
              <span className="font-mono">
                {input.length}/{MAX_QUESTION_LENGTH}
              </span>
            ) : null}
            {question && !busy ? (
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 rounded-md text-muted transition-colors hover:text-fg"
              >
                <RotateCcw size={12} aria-hidden="true" />
                New question
              </button>
            ) : null}
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-subtle">{assistantCopy.disclaimer}</p>
      </form>
    </div>
  );
}
