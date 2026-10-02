import { CheckCircle2, Cloud } from "lucide-react";
import { pipelineFact } from "@/data/experience";

/**
 * Conceptual view of the "8-system automation pipeline across 2 AWS accounts".
 * Deliberately generic: no real system names, services or identifiers.
 */

const perAccount = pipelineFact.systems / pipelineFact.accounts;
const accounts = Array.from({ length: pipelineFact.accounts }, (_, a) => ({
  label: `AWS account ${String.fromCharCode(65 + a)}`,
  systems: Array.from({ length: perAccount }, (_, i) => a * perAccount + i + 1),
}));

function SystemNode({ n }: { n: number }) {
  return (
    <li className="relative z-10 grid size-11 place-items-center rounded-xl border border-line-strong bg-surface-2 font-mono text-xs text-fg shadow-[0_0_0_4px_var(--color-surface)] sm:size-12">
      {String(n).padStart(2, "0")}
    </li>
  );
}

export function PipelineDiagram() {
  return (
    <figure className="card overflow-hidden p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium text-fg">
          {pipelineFact.systems}-system automation pipeline · {pipelineFact.accounts} AWS accounts
        </p>
        <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">Conceptual view</span>
      </div>

      <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        {accounts.map((acct, idx) => (
          <div key={acct.label} className="contents">
            {idx > 0 ? (
              <div aria-hidden="true" className="relative mx-auto h-8 w-px bg-line-strong lg:h-px lg:w-10">
                <span className="packet-y absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-cyan lg:hidden" />
                <span className="packet-x absolute top-1/2 hidden size-1.5 -translate-y-1/2 rounded-full bg-cyan lg:block" />
              </div>
            ) : null}
            <div className="flex-1 rounded-2xl border border-dashed border-white/15 bg-white/[0.015] p-4">
              <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted">
                <Cloud size={13} className="text-blue" aria-hidden="true" />
                {acct.label}
              </p>
              <div className="relative">
                <div aria-hidden="true" className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-cyan/40 via-blue/40 to-violet/40">
                  <span
                    className="packet-x absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_10px_2px_rgb(34_211_238/0.5)]"
                    style={{ ["--d" as string]: `${idx * 1.2}s` }}
                  />
                </div>
                <ol className="relative flex justify-between" aria-label={`Systems in ${acct.label}`}>
                  {acct.systems.map((n) => (
                    <SystemNode key={n} n={n} />
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white/[0.02] p-4">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">Validated with</p>
        <ul className="flex flex-wrap gap-2">
          {pipelineFact.verification.map((v) => (
            <li key={v} className="chip">
              <CheckCircle2 size={13} className="text-cyan" aria-hidden="true" />
              {v}
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="mt-4 text-xs leading-relaxed text-subtle">
        Simplified illustration of the pipeline&apos;s scale. Node placement and roles are illustrative and do not
        reflect the actual (confidential) architecture.
      </figcaption>
    </figure>
  );
}
