"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { getLensDefinition, recruiterLenses } from "@/data/recruiter-lenses";
import { applyLensToDocument, setRecruiterLens, useRecruiterLens } from "@/lib/recruiter-lens/store";
import { cn } from "@/lib/utils";

/**
 * Recruiter Lens control. A single-choice ARIA radiogroup: Tab moves into the
 * group, arrow keys move and select, Home/End jump to the ends.
 */
export function LensSelector() {
  const lens = useRecruiterLens();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = getLensDefinition(lens);

  // Keep <html data-lens> in sync with the selected lens.
  useEffect(() => applyLensToDocument(lens), [lens]);

  function select(index: number, focus: boolean) {
    const next = recruiterLenses[(index + recruiterLenses.length) % recruiterLenses.length];
    setRecruiterLens(next.id);
    if (focus) refs.current[recruiterLenses.indexOf(next)]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const index = recruiterLenses.findIndex((l) => l.id === lens);
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: recruiterLenses.length - 1,
    };
    if (e.key in moves) {
      e.preventDefault();
      select(moves[e.key], true);
    }
  }

  return (
    <section id="lens" aria-labelledby="lens-heading" className="relative pb-4 sm:pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="card flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <p className="eyebrow">Recruiter lens</p>
            <h2 id="lens-heading" className="mt-1.5 text-lg font-semibold tracking-tight text-fg">
              Explore my profile
            </h2>
            <p id="lens-hint" className="mt-1 text-sm text-muted">
              Pick a focus to highlight the most relevant evidence. Nothing is hidden or rewritten.
            </p>
          </div>

          <div
            role="radiogroup"
            aria-labelledby="lens-heading"
            aria-describedby="lens-hint"
            onKeyDown={onKeyDown}
            className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[34rem]"
          >
            {recruiterLenses.map((option, i) => {
              const selected = option.id === lens;
              return (
                <button
                  key={option.id}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i, false)}
                  className={cn(
                    "flex min-h-[3.75rem] flex-col items-start justify-center rounded-xl border px-3 py-2 text-left transition-[border-color,background-color,box-shadow] duration-200",
                    selected
                      ? "border-cyan/50 bg-cyan/[0.06] shadow-[0_0_24px_-10px_rgb(34_211_238/0.6)]"
                      : "border-line bg-white/[0.02] hover:border-line-strong hover:bg-white/[0.04]",
                  )}
                >
                  <span className={cn("text-sm font-medium", selected ? "text-fg" : "text-muted")}>{option.label}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 font-mono text-[10px] uppercase tracking-wider",
                      selected ? "text-cyan" : "text-transparent",
                    )}
                  >
                    ● Active
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/*
          All descriptions share one grid cell; only the active one is visible.
          The block is always as tall as the longest description, so switching
          lenses never shifts the page below.
        */}
        <div className="mt-3 grid px-1 text-sm leading-relaxed text-muted">
          {recruiterLenses.map((option) => (
            <p
              key={option.id}
              aria-hidden={option.id !== lens}
              className={cn("[grid-area:1/1]", option.id !== lens && "invisible")}
            >
              {option.description}
              {option.lookIn.length > 0 ? (
                <span className="text-subtle">
                  {" "}
                  Look in{" "}
                  {option.lookIn.map((s, i) => (
                    <span key={s.id}>
                      {i > 0 ? (i === option.lookIn.length - 1 ? " and " : ", ") : null}
                      <a
                        href={`#${s.id}`}
                        tabIndex={option.id === lens ? undefined : -1}
                        className="text-muted underline decoration-white/20 underline-offset-4 hover:text-fg hover:decoration-cyan"
                      >
                        {s.label}
                      </a>
                    </span>
                  ))}
                  .
                </span>
              ) : null}
            </p>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {active.label} lens selected. {active.description}
        </p>
      </div>
    </section>
  );
}
