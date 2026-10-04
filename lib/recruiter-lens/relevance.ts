import { lensEvidence, type FocusLens, type LensEvidence, type RecruiterLens } from "@/data/recruiter-lenses";
import { skillGroups } from "@/data/skills";
import { experience, type Role } from "@/data/experience";
import { projects } from "@/data/projects";
import { education } from "@/data/education";

/**
 * Relevance helpers for Recruiter Lens. Components call these to tag existing
 * items; the actual emphasis is pure CSS keyed on <html data-lens="...">.
 */

const FOCUS_LENSES = Object.keys(lensEvidence) as FocusLens[];

function lensesWhere(test: (evidence: LensEvidence) => boolean): FocusLens[] {
  return FOCUS_LENSES.filter((lens) => test(lensEvidence[lens]));
}

export const lensesForSkill = (skill: string) => lensesWhere((e) => e.skills.includes(skill));
export const lensesForStackItem = (item: string) => lensesWhere((e) => e.experienceStack.includes(item));
export const lensesForHighlight = (id: string) => lensesWhere((e) => e.experienceHighlights.includes(id));
export const lensesForProject = (slug: string) => lensesWhere((e) => e.projects.includes(slug));
export const lensesForEducation = (id: string) => lensesWhere((e) => e.education.includes(id));
export const lensesForPipeline = () => lensesWhere((e) => e.pipeline);

/** A role is relevant when at least one of its statements is. */
export const lensesForRole = (role: Role) =>
  FOCUS_LENSES.filter((lens) => role.highlights.some((h) => lensEvidence[lens].experienceHighlights.includes(h.id)));

/**
 * An experience chip counts only inside a role that is itself evidence for the
 * lens, so a shared chip (e.g. "Python") doesn't light up in an unrelated role.
 */
export const lensesForRoleStackItem = (role: Role, item: string) => {
  const roleLenses = lensesForRole(role);
  return lensesForStackItem(item).filter((lens) => roleLenses.includes(lens));
};

/** A skill group is relevant when at least one of its skills is. */
export const lensesForSkills = (skills: string[]) =>
  FOCUS_LENSES.filter((lens) => skills.some((s) => lensEvidence[lens].skills.includes(s)));

export function isRelevant(lens: RecruiterLens, lenses: FocusLens[]): boolean {
  return lens !== "full" && lenses.includes(lens);
}

/**
 * Data attributes that opt an element into lens emphasis.
 * - Leaf items (chips, bullets, cards without nested items) also dim slightly
 *   when they don't match the active lens.
 * - Containers (`dim: false`) only get highlighted, so nested dimming never compounds.
 */
export function lensAttrs(lenses: FocusLens[], options: { dim?: boolean } = {}) {
  return {
    "data-lens-tags": lenses.join(" "),
    ...(options.dim === false ? {} : { "data-lens-dim": "" }),
  };
}

// --- Integrity check ------------------------------------------------------
// Fails the build (and dev server) if the mapping references something that
// doesn't exist, e.g. after a skill or project is renamed.
function validateMapping() {
  const skills = new Set(skillGroups.flatMap((g) => g.skills));
  const stack = new Set(experience.flatMap((r) => r.stack));
  const highlights = new Set(experience.flatMap((r) => r.highlights.map((h) => h.id)));
  const slugs = new Set(projects.map((p) => p.slug));
  const educationIds = new Set(education.map((e) => e.id));
  const problems: string[] = [];

  for (const lens of FOCUS_LENSES) {
    const e = lensEvidence[lens];
    const missing = (kind: string, values: string[], known: Set<string>) =>
      values.filter((v) => !known.has(v)).forEach((v) => problems.push(`${lens}.${kind}: "${v}"`));
    missing("skills", e.skills, skills);
    missing("experienceStack", e.experienceStack, stack);
    missing("experienceHighlights", e.experienceHighlights, highlights);
    missing("projects", e.projects, slugs);
    missing("education", e.education, educationIds);
  }
  if (problems.length > 0) {
    throw new Error(`Recruiter Lens mapping references unknown items:\n${problems.join("\n")}`);
  }
}
validateMapping();
