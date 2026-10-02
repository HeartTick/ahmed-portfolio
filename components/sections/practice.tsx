import {
  Activity,
  Cloud,
  Database,
  FileSpreadsheet,
  GitBranch,
  Plug,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { practices, type PracticeIcon } from "@/data/practice";
import { Section } from "@/components/ui/section";

const icons: Record<PracticeIcon, LucideIcon> = {
  file: FileSpreadsheet,
  plug: Plug,
  shield: ShieldCheck,
  database: Database,
  cloud: Cloud,
  git: GitBranch,
  activity: Activity,
  wrench: Wrench,
};

export function Practice() {
  return (
    <Section
      id="practice"
      eyebrow="Engineering in practice"
      title="What the day-to-day work looks like"
      intro="Recurring patterns from professional backend and automation work. Described in general terms; no proprietary systems are shown."
    >
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {practices.map((p) => {
          const Icon = icons[p.icon];
          return (
            <li key={p.title} className="reveal group bg-bg/95 p-5 transition-colors hover:bg-surface sm:p-6">
              <span className="grid size-9 place-items-center rounded-lg border border-line bg-white/[0.03] text-blue transition-colors group-hover:text-cyan">
                <Icon size={17} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[15px] font-medium text-fg">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
