"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getLensDefinition } from "@/data/recruiter-lenses";
import { setRecruiterLens, useRecruiterLens } from "@/lib/recruiter-lens/store";

/**
 * Small floating reminder of the active lens, shown only while a focused lens
 * is active and the selector itself is scrolled out of view. Fixed position,
 * so it never shifts page layout.
 */
export function LensStatus() {
  const lens = useRecruiterLens();
  const [selectorVisible, setSelectorVisible] = useState(true);

  useEffect(() => {
    const target = document.getElementById("lens");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setSelectorVisible(entry.isIntersecting), {
      rootMargin: "-64px 0px 0px 0px",
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (lens === "full" || selectorVisible) return null;
  const { label } = getLensDefinition(lens);

  return (
    <div
      role="region"
      aria-label="Recruiter lens"
      className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-cyan/30 bg-bg/85 p-1 pl-1 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl sm:left-6 sm:translate-x-0"
    >
      <a
        href="#lens"
        className="flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-cyan hover:bg-white/[0.05]"
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-cyan" />
        {label} lens
        <span className="sr-only">: change lens</span>
      </a>
      <button
        type="button"
        onClick={() => setRecruiterLens("full")}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted hover:bg-white/[0.05] hover:text-fg"
      >
        <X size={12} aria-hidden="true" />
        Full profile
      </button>
    </div>
  );
}
