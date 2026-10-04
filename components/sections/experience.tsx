import { Briefcase } from "lucide-react";
import { experience, pipelinePhrase, type Role } from "@/data/experience";
import { Section } from "@/components/ui/section";
import { PipelineDiagram } from "@/components/visuals/pipeline-diagram";
import { LensBadge } from "@/components/recruiter-lens/lens-badge";
import { lensAttrs, lensesForHighlight, lensesForPipeline, lensesForRole, lensesForRoleStackItem } from "@/lib/recruiter-lens/relevance";
import { cn } from "@/lib/utils";

/** Bold the headline pipeline fact wherever it appears, as on the résumé. */
function emphasize(text: string) {
  const [before, after] = text.split(pipelinePhrase);
  if (after === undefined) return text;
  return (
    <>
      {before}
      <strong className="font-medium text-fg">{pipelinePhrase}</strong>
      {after}
    </>
  );
}

function RoleMeta({ role }: { role: Role }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-subtle">
      <span>
        <time dateTime={role.startISO}>{role.start}</time> – <time dateTime={role.endISO}>{role.end}</time>
      </span>
      <span aria-hidden="true">·</span>
      <span>{role.mode}</span>
    </p>
  );
}

function RoleCard({ role }: { role: Role }) {
  return (
    <article
      className={cn("reveal card p-6 sm:p-8", role.featured && "border-white/12")}
      {...lensAttrs(lensesForRole(role), { dim: false })}
    >
      <LensBadge />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className={cn("font-semibold tracking-tight text-fg", role.featured ? "text-xl sm:text-2xl" : "text-lg")}>
            {role.title}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {role.company} <span className="text-subtle">({role.companyLegal})</span>
          </p>
        </div>
        <RoleMeta role={role} />
      </div>

      <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted sm:text-[15px]">
        {role.highlights.map((h) => (
          <li key={h.id} className="relative flex gap-3" data-lens-bullet="" {...lensAttrs(lensesForHighlight(h.id))}>
            <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-cyan/70" />
            <span>{emphasize(h.text)}</span>
          </li>
        ))}
      </ul>

      {role.featured ? (
        <div className="mt-8">
          <PipelineDiagram {...lensAttrs(lensesForPipeline())} />
        </div>
      ) : null}

      <ul className="mt-6 flex flex-wrap gap-2" aria-label={`Technologies used as ${role.title}`}>
        {role.stack.map((t) => (
          <li key={t} className="chip" {...lensAttrs(lensesForRoleStackItem(role, t))}>
            {t}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Professional experience"
      intro="Backend, automation and data work at ProjectXpert, from an internship to an associate developer role."
    >
      <ol className="relative space-y-6 border-l border-line pl-6 sm:pl-10">
        {experience.map((role) => (
          <li key={role.id} className="relative">
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-8 -left-[calc(1.5rem+13px)] grid size-[25px] place-items-center rounded-full border bg-bg sm:-left-[calc(2.5rem+13px)]",
                role.featured ? "border-cyan/60 text-cyan" : "border-line-strong text-subtle",
              )}
            >
              <Briefcase size={12} />
            </span>
            <RoleCard role={role} />
          </li>
        ))}
      </ol>
    </Section>
  );
}
