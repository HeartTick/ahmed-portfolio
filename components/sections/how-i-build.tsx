"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { buildStages } from "@/data/practice";
import { cn } from "@/lib/utils";

/**
 * Interactive pipeline. Implemented as an ARIA tablist so it is fully
 * keyboard operable (arrow keys, Home/End).
 */
export function HowIBuild() {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useReducedMotion();
  const baseId = useId();
  const stage = buildStages[index];
  const progress = buildStages.length > 1 ? index / (buildStages.length - 1) : 0;

  function focusTab(i: number) {
    const next = (i + buildStages.length) % buildStages.length;
    setIndex(next);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(index + 1),
      ArrowDown: () => focusTab(index + 1),
      ArrowLeft: () => focusTab(index - 1),
      ArrowUp: () => focusTab(index - 1),
      Home: () => focusTab(0),
      End: () => focusTab(buildStages.length - 1),
    };
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  }

  return (
    <div className="reveal card p-4 sm:p-8">
      <div className="relative">
        {/* connector line + progress (desktop) */}
        <div aria-hidden="true" className="absolute top-5 right-[8%] left-[8%] hidden h-px bg-line md:block">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-cyan to-violet"
            initial={false}
            animate={{ scaleX: progress }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div
          role="tablist"
          aria-label="Engineering workflow stages"
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="relative grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-0"
        >
          {buildStages.map((s, i) => {
            const selected = i === index;
            const done = i < index;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${s.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setIndex(i)}
                onMouseEnter={() => {
                  if (window.matchMedia("(hover: hover)").matches) setIndex(i);
                }}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-xl px-1 py-2 text-center transition-colors md:py-0",
                  "max-md:border max-md:border-line",
                  selected ? "max-md:bg-white/[0.05]" : "max-md:bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "relative grid size-10 place-items-center rounded-full border font-mono text-xs transition-colors duration-300",
                    selected
                      ? "border-cyan bg-cyan/10 text-cyan shadow-[0_0_24px_-4px_rgb(34_211_238/0.6)]"
                      : done
                        ? "border-cyan/40 bg-bg text-cyan/80"
                        : "border-line-strong bg-bg text-subtle group-hover:text-fg",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors sm:text-sm",
                    selected ? "text-fg" : "text-muted group-hover:text-fg",
                  )}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${stage.id}`}
        className="mt-6 min-h-[11rem] rounded-2xl border border-line bg-white/[0.02] p-5 sm:mt-10 sm:min-h-[9.5rem] sm:p-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.22 }}
            className="grid gap-5 md:grid-cols-[1.4fr_1fr] md:gap-10"
          >
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-fg">{stage.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">{stage.description}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">Typical tools</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {stage.tools.map((t) => (
                  <li key={t} className="chip border-cyan/20 text-fg">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
