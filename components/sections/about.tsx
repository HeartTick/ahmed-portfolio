import Image from "next/image";
import { Languages, MapPin, Sparkles, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { about, hobbies, languages, technicalInterests } from "@/data/profile";
import { Section } from "@/components/ui/section";

function Avatar() {
  if (siteConfig.portrait) {
    return (
      <Image
        src={siteConfig.portrait}
        alt={`Portrait of ${siteConfig.name}`}
        width={96}
        height={96}
        className="size-20 rounded-2xl border border-line-strong object-cover"
      />
    );
  }
  // Geometric monogram used until a real portrait is configured.
  return (
    <div
      aria-hidden="true"
      className="relative grid size-20 place-items-center overflow-hidden rounded-2xl border border-line-strong bg-surface-2"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(34_211_238/0.35),transparent_55%),radial-gradient(circle_at_80%_90%,rgb(167_139_250/0.35),transparent_55%)]" />
      <span className="relative font-mono text-xl font-semibold tracking-wider text-fg">{siteConfig.initials}</span>
    </div>
  );
}

export function About() {
  return (
    <Section id="about" eyebrow="About" title={about.heading}>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
        <div className="reveal space-y-5 text-base leading-relaxed text-muted text-pretty sm:text-[17px]">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>

        <aside className="reveal card p-6" aria-label="Personal details">
          <div className="flex items-center gap-4">
            <Avatar />
            <div>
              <p className="font-medium text-fg">{siteConfig.name}</p>
              <p className="mt-0.5 text-sm text-muted">{siteConfig.role}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-subtle">
                <MapPin size={12} aria-hidden="true" />
                {siteConfig.location}
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-5 border-t border-line pt-5 text-sm">
            <div>
              <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-subtle">
                <Languages size={13} aria-hidden="true" /> Languages
              </dt>
              {languages.map((l) => (
                <dd key={l.name} className="mt-2 flex flex-wrap justify-between gap-x-3 text-muted">
                  <span className="text-fg">{l.name}</span>
                  <span>{l.level}</span>
                </dd>
              ))}
            </div>
            <div>
              <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-subtle">
                <Sparkles size={13} aria-hidden="true" /> Technical interests
              </dt>
              <dd className="mt-2 text-muted">{technicalInterests.join(" · ")}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-subtle">
                <Heart size={13} aria-hidden="true" /> Outside work
              </dt>
              <dd className="mt-2 text-muted">{hobbies.join(" · ")}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </Section>
  );
}
