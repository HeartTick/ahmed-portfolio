import { ArrowDown, Download, GraduationCap } from "lucide-react";
import { siteConfig } from "@/config/site";
import { hero, snapshot } from "@/data/profile";
import { SocialLinks } from "@/components/ui/social-links";
import { SystemGraph } from "@/components/visuals/system-graph";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8">
        <div>
          <p className="rise flex items-center gap-2 font-mono text-xs text-muted" style={{ ["--i" as string]: 0 }}>
            <span className="relative flex size-2">
              <span className="pulse-soft absolute inline-flex size-full rounded-full bg-cyan/60" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan" />
            </span>
            <GraduationCap size={14} aria-hidden="true" className="text-subtle" />
            {hero.eyebrow}
          </p>

          <h1 id="hero-heading" className="rise mt-6" style={{ ["--i" as string]: 1 }}>
            <span className="block text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-fg sm:text-6xl lg:text-[4.25rem]">
              {siteConfig.name}
            </span>{" "}
            <span className="text-gradient mt-3 block text-2xl font-medium tracking-tight sm:text-3xl lg:text-[2.1rem]">
              {hero.headline}
            </span>
          </h1>

          <ul
            className="rise mt-5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[13px] text-muted"
            style={{ ["--i" as string]: 2 }}
            aria-label="Focus areas"
          >
            {siteConfig.focusAreas.map((area, i) => (
              <li key={area} className="flex items-center gap-3 whitespace-nowrap">
                {area}
                {i < siteConfig.focusAreas.length - 1 ? (
                  <span aria-hidden="true" className="text-subtle/60">/</span>
                ) : null}
              </li>
            ))}
          </ul>

          <p
            className="rise mt-6 max-w-xl text-base leading-relaxed text-muted text-pretty sm:text-lg"
            style={{ ["--i" as string]: 3 }}
          >
            {hero.statement}
          </p>

          <div className="rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ ["--i" as string]: 4 }}>
            <a href="#experience" className="btn btn-primary">
              Explore My Work
              <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a href={siteConfig.resumePath} download className="btn btn-ghost">
              <Download size={16} aria-hidden="true" />
              Download Résumé
            </a>
            <SocialLinks className="mt-2 sm:mt-0 sm:ml-2" />
          </div>
        </div>

        <div className="rise lg:pl-4" style={{ ["--i" as string]: 3 }}>
          <SystemGraph />
        </div>
      </div>

      {/* Professional snapshot */}
      <div className="mx-auto mt-16 max-w-6xl px-4 sm:mt-20 sm:px-6 lg:px-8">
        <h2 className="sr-only">Professional snapshot</h2>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
          {snapshot.map((item, i) => (
            <div key={item.label} className="rise bg-bg/90 p-4 sm:p-6" style={{ ["--i" as string]: 5 + i }}>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-subtle">{item.label}</dt>
              <dd className="mt-2 text-lg font-semibold tracking-tight text-fg sm:text-xl">{item.value}</dd>
              <dd className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
