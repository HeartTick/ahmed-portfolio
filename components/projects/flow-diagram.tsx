import {
  Activity,
  AudioWaveform,
  BrainCircuit,
  Cpu,
  Globe,
  ListFilter,
  Radio,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { FlowStep } from "@/data/projects";
import { cn } from "@/lib/utils";

const iconsBySlug: Record<string, LucideIcon[]> = {
  "arrhythmia-classification": [Radio, AudioWaveform, BrainCircuit, Activity],
  "phishing-detection": [Globe, ListFilter, Cpu, ShieldCheck],
};

type Props = {
  slug: string;
  steps: FlowStep[];
  /** Compact = used inside project cards. */
  compact?: boolean;
  className?: string;
};

/** Horizontal flow on wider screens, vertical stack on narrow ones. */
export function FlowDiagram({ slug, steps, compact = false, className }: Props) {
  const icons = iconsBySlug[slug] ?? [];
  return (
    <ol
      className={cn(
        "relative grid gap-3",
        compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
      aria-label="Workflow"
    >
      {steps.map((step, i) => {
        const Icon = icons[i];
        const last = i === steps.length - 1;
        return (
          <li
            key={step.label}
            className={cn(
              "relative rounded-xl border border-line bg-surface-2/70",
              compact ? "p-3" : "p-4",
              last && "border-cyan/30",
            )}
          >
            <div className="flex items-center gap-2">
              {Icon ? (
                <span
                  className={cn(
                    "grid shrink-0 place-items-center rounded-lg border border-line bg-white/[0.03]",
                    compact ? "size-7" : "size-9",
                    last ? "text-cyan" : "text-blue",
                  )}
                >
                  <Icon size={compact ? 14 : 17} aria-hidden="true" />
                </span>
              ) : null}
              <span className="font-mono text-[10px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p className={cn("mt-2 font-medium text-fg", compact ? "text-[13px]" : "text-sm")}>{step.label}</p>
            {!compact ? <p className="mt-1 text-xs leading-relaxed text-muted">{step.detail}</p> : null}
            {!last ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 -right-[9px] z-10 hidden size-4 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg text-[9px] text-subtle",
                  compact ? "sm:grid" : "lg:grid",
                )}
              >
                →
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
