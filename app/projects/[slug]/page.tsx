import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, FlaskConical, Info } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { FlowDiagram } from "@/components/projects/flow-diagram";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.shortTitle,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, url: `/projects/${project.slug}` },
  };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <section aria-labelledby={id} className="reveal border-t border-line py-10 sm:grid sm:grid-cols-[12rem_1fr] sm:gap-10">
      <h2 id={id} className="font-mono text-xs uppercase tracking-wider text-subtle sm:pt-1">
        {title}
      </h2>
      <div className="mt-4 text-base leading-relaxed text-muted text-pretty sm:mt-0 sm:text-[17px]">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6 sm:pt-36 lg:px-8">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 rounded-lg text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        All projects
      </Link>

      <header className="mt-8">
        <span className="rise chip text-[11px]" style={{ ["--i" as string]: 0 }}>
          <FlaskConical size={12} className="text-violet" aria-hidden="true" />
          {project.badge}
        </span>
        <h1
          className="rise mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-fg text-balance sm:text-5xl"
          style={{ ["--i" as string]: 1 }}
        >
          {project.title}
        </h1>
        <p className="rise mt-5 max-w-2xl text-lg leading-relaxed text-muted" style={{ ["--i" as string]: 2 }}>
          {project.tagline}
        </p>
        <ul className="rise mt-6 flex flex-wrap gap-2" style={{ ["--i" as string]: 3 }} aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      </header>

      <figure className="rise card mt-12 p-4 sm:p-6" style={{ ["--i" as string]: 4 }}>
        <FlowDiagram slug={project.slug} steps={project.flow} />
        <figcaption className="mt-4 text-xs text-subtle">Simplified architecture / data flow.</figcaption>
      </figure>

      {project.disclaimer ? (
        <p className="mt-6 flex items-start gap-3 rounded-xl border border-line bg-white/[0.02] p-4 text-sm text-muted">
          <Info size={16} className="mt-0.5 shrink-0 text-blue" aria-hidden="true" />
          {project.disclaimer}
        </p>
      ) : null}

      <div className="mt-12">
        <Block title="Overview">
          <p>{project.overview}</p>
        </Block>
        <Block title="Problem">
          <p>{project.problem}</p>
        </Block>
        <Block title="Approach">
          <ol className="space-y-3">
            {project.approach.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="mt-0.5 font-mono text-xs text-cyan">{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Block>
        <Block title="Technologies">
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </Block>
        <Block title="What I built">
          <ul className="space-y-3">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-cyan/70" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </Block>
        <Block title="Learning">
          <p>{project.learning}</p>
        </Block>
        {project.links.length > 0 ? (
          <Block title="Links">
            <ul className="flex flex-wrap gap-3">
              {project.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    {l.label}
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </Block>
        ) : null}
      </div>

      {next && next.slug !== project.slug ? (
        <nav aria-label="Next project" className="mt-8 border-t border-line pt-10">
          <Link
            href={`/projects/${next.slug}`}
            className="group card flex items-center justify-between gap-4 p-6 transition-colors hover:border-line-strong"
          >
            <span>
              <span className="block font-mono text-[11px] uppercase tracking-wider text-subtle">Next project</span>
              <span className="mt-1 block text-lg font-medium text-fg">{next.title}</span>
            </span>
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-fg"
            />
          </Link>
        </nav>
      ) : null}
    </article>
  );
}
