import { BrainCircuit, Cloud, Database, GitBranch, Server, type LucideIcon } from "lucide-react";
import { skillGroups, type SkillIcon } from "@/data/skills";
import { Section } from "@/components/ui/section";
import { lensAttrs, lensesForSkill, lensesForSkills } from "@/lib/recruiter-lens/relevance";
import { cn } from "@/lib/utils";

const icons: Record<SkillIcon, LucideIcon> = {
  server: Server,
  database: Database,
  cloud: Cloud,
  git: GitBranch,
  brain: BrainCircuit,
};

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Tools I work with"
      intro="Grouped by where they show up in my work, without self-rated percentages."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {skillGroups.map((group, i) => {
          const Icon = icons[group.icon];
          return (
            <article
              key={group.id}
              className={cn("reveal card p-6", i < 2 ? "lg:col-span-3" : "lg:col-span-2")}
              {...lensAttrs(lensesForSkills(group.skills), { dim: false })}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg border border-line bg-white/[0.03] text-cyan">
                  <Icon size={17} aria-hidden="true" />
                </span>
                <h3 className="font-medium text-fg">{group.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted">{group.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((s) => (
                  <li key={s} className="chip" {...lensAttrs(lensesForSkill(s))}>
                    {s}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
