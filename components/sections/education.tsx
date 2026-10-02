import { GraduationCap, MapPin } from "lucide-react";
import { education } from "@/data/education";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Education">
      <div className="grid gap-4 md:grid-cols-2">
        {education.map((e, i) => (
          <article
            key={e.id}
            className={cn("reveal card p-6", i === 0 && "bg-[linear-gradient(160deg,rgb(34_211_238/0.06),transparent_45%)]")}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03]",
                  i === 0 ? "text-cyan" : "text-muted",
                )}
              >
                <GraduationCap size={18} aria-hidden="true" />
              </span>
              {e.status ? (
                <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 font-mono text-[11px] text-cyan">
                  {e.status}
                </span>
              ) : null}
            </div>
            <h3 className="mt-5 font-semibold tracking-tight text-fg">{e.degree}</h3>
            <p className="mt-1 text-sm text-muted">{e.institution}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-subtle">
              <span>
                {e.start} – {e.end}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin size={11} aria-hidden="true" />
                {e.location}
              </span>
              {e.note ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-muted">{e.note}</span>
                </>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
