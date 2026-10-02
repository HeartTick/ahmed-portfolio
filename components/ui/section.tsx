import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Standard page section with an accessible, consistent heading block. */
export function Section({ id, eyebrow, title, intro, children, className }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("relative py-20 sm:py-28", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="reveal mb-10 max-w-2xl sm:mb-14">
          <p className="eyebrow">{eyebrow}</p>
          <h2
            id={headingId}
            className="mt-3 text-3xl font-semibold tracking-tight text-fg text-balance sm:text-4xl"
          >
            {title}
          </h2>
          {intro ? <div className="mt-4 text-base leading-relaxed text-muted text-pretty">{intro}</div> : null}
        </header>
        {children}
      </div>
    </section>
  );
}
