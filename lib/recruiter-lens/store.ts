import { useSyncExternalStore } from "react";
import { DEFAULT_LENS, type RecruiterLens } from "@/data/recruiter-lenses";

/**
 * Client-side Recruiter Lens state, held in memory only. Nothing is stored or
 * sent anywhere: every load or refresh starts with Full Profile.
 */

const listeners = new Set<() => void>();
let current: RecruiterLens = DEFAULT_LENS;

function getSnapshot(): RecruiterLens {
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Mirrors the lens onto <html data-lens>, which drives all emphasis styles. */
export function applyLensToDocument(lens: RecruiterLens) {
  const root = document.documentElement;
  if (lens === "full") delete root.dataset.lens;
  else root.dataset.lens = lens;
}

export function setRecruiterLens(lens: RecruiterLens) {
  current = lens;
  applyLensToDocument(lens);
  listeners.forEach((listener) => listener());
}

/** Server render and hydration use the default, so markup never mismatches. */
export function useRecruiterLens(): RecruiterLens {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_LENS);
}
