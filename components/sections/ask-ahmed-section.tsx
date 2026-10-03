import { Check } from "lucide-react";
import { assistantCopy } from "@/data/assistant";
import { isAssistantConfigured } from "@/lib/ai/provider";
import { Section } from "@/components/ui/section";
import { AskAhmed } from "@/components/assistant/ask-ahmed";

/** Server wrapper: only a boolean about configuration reaches the client. */
export function AskAhmedSection() {
  const available = isAssistantConfigured();

  return (
    <Section id="ask" eyebrow={assistantCopy.eyebrow} title={assistantCopy.title}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.9fr] lg:gap-12">
        <div className="reveal">
          <p className="text-base leading-relaxed text-muted text-pretty">{assistantCopy.intro}</p>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            {assistantCopy.principles.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-line bg-white/[0.03] text-cyan">
                  <Check size={12} aria-hidden="true" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal">
          <AskAhmed available={available} />
        </div>
      </div>
    </Section>
  );
}
