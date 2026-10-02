import Link from "next/link";
import { ArrowUpRight, FlaskConical } from "lucide-react";
import { projects } from "@/data/projects";
import { Section } from "@/components/ui/section";
import { Spotlight } from "@/components/ui/spotlight";
import { FlowDiagram } from "@/components/projects/flow-diagram";

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected academic projects"
      intro="Machine-learning work from my studies. Each project has a short case study covering the problem, approach and architecture."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <Spotlight key={project.slug} className="reveal group flex flex-col p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="chip text-[11px]">
                <FlaskConical size={12} className="text-violet" aria-hidden="true" />
                {project.badge}
              </span>
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="text-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
              />
            </div>

            <h3 className="mt-5 text-xl font-semibold tracking-tight text-fg text-balance">
              <Link
                href={`/projects/${project.slug}`}
                className="after:absolute after:inset-0 after:rounded-[1.25rem] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-cyan"
              >
                {project.title}
              </Link>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">{project.summary}</p>

            <FlowDiagram slug={project.slug} steps={project.flow} compact className="mt-6" />

            <div className="mt-6 flex flex-1 items-end justify-between gap-4">
              <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                {project.tech.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
              <span className="hidden shrink-0 text-sm text-muted transition-colors group-hover:text-fg sm:inline">
                Case study
              </span>
            </div>
          </Spotlight>
        ))}
      </div>
    </Section>
  );
}
