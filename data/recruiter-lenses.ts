/**
 * Recruiter Lens: which existing, verified items are evidence for each lens.
 *
 * This file contains no résumé content of its own. It only points at items
 * that already exist in the other data files, by stable id or exact text:
 *   - skills / experienceStack: exact chip text from data/skills.ts and the
 *     `stack` arrays in data/experience.ts
 *   - experienceHighlights: highlight ids from data/experience.ts
 *   - projects: project slugs from data/projects.ts
 *   - education: ids from data/education.ts
 *
 * lib/recruiter-lens/relevance.ts validates every reference at build time.
 * The lens only changes emphasis on the page; it never changes facts, and it
 * never changes what Ask Ahmed AI is told.
 */

import { suggestedQuestions } from "@/data/assistant";

export type RecruiterLens = "full" | "backend" | "cloud" | "ai";
export type FocusLens = Exclude<RecruiterLens, "full">;

export const DEFAULT_LENS: RecruiterLens = "full";

export type LensEvidence = {
  skills: string[];
  experienceStack: string[];
  experienceHighlights: string[];
  /** The 8-system / 2-AWS-account pipeline diagram. */
  pipeline: boolean;
  projects: string[];
  education: string[];
};

export const lensEvidence: Record<FocusLens, LensEvidence> = {
  backend: {
    skills: [
      "Python",
      "Django REST Framework",
      "Flask",
      "REST APIs",
      "Data validation",
      "Data integration",
      "SQL",
      "PostgreSQL",
      "Redis",
    ],
    experienceStack: ["Python", "Django", "Flask", "REST APIs", "PostgreSQL", "Redis"],
    // The internship's Excel/data-processing scripts are intentionally not
    // treated as backend-specific evidence.
    experienceHighlights: ["automation-workflows", "django-flask-services", "engineering-tooling"],
    pipeline: false,
    projects: [],
    education: [],
  },
  cloud: {
    skills: ["AWS Lambda", "AWS ECS", "AWS RDS", "AWS S3", "AWS CloudWatch", "Docker", "Linux", "GitHub Actions", "CI/CD"],
    experienceStack: ["AWS", "Docker", "Linux", "GitHub Actions"],
    experienceHighlights: ["automation-workflows", "aws-automation-pipeline", "engineering-tooling"],
    pipeline: true,
    projects: [],
    education: [],
  },
  ai: {
    // Academic ML evidence only. Claude / GitHub Copilot (AI-assisted
    // development tools) are deliberately not treated as ML evidence.
    skills: ["CNN classification", "Machine learning"],
    experienceStack: [],
    experienceHighlights: [],
    pipeline: false,
    projects: ["arrhythmia-classification", "phishing-detection"],
    // The M.Sc. (Computational Modeling and Simulation) is not itself verified
    // AI/ML evidence, so no education entry is mapped.
    education: [],
  },
};

export type LensDefinition = {
  id: RecruiterLens;
  label: string;
  /** Neutral description of what gets highlighted. No judgement of fit. */
  description: string;
  /** Sections that contain highlighted evidence. */
  lookIn: { id: string; label: string }[];
  /** Ask Ahmed AI suggestion chips while this lens is active (UI only). */
  suggestedQuestions: string[];
};

/** Control order: focused lenses first, Full Profile last. */
export const recruiterLenses: LensDefinition[] = [
  {
    id: "backend",
    label: "Backend",
    description: "Highlights Python services, REST APIs, databases and data validation.",
    lookIn: [
      { id: "experience", label: "Experience" },
      { id: "skills", label: "Skills" },
    ],
    suggestedQuestions: [
      "What backend experience does Ahmed have?",
      "Which databases has Ahmed worked with?",
      "What API experience does Ahmed have?",
    ],
  },
  {
    id: "cloud",
    label: "Cloud / AWS",
    description: "Highlights AWS services, Docker, CI/CD and the 8-system pipeline across 2 AWS accounts.",
    lookIn: [
      { id: "experience", label: "Experience" },
      { id: "skills", label: "Skills" },
    ],
    suggestedQuestions: [
      "Which AWS services has Ahmed used?",
      "Tell me about the 8-system automation pipeline.",
      "What CI/CD experience does Ahmed have?",
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    description: "Highlights the academic machine-learning projects and related skills.",
    lookIn: [
      { id: "projects", label: "Projects" },
      { id: "skills", label: "Skills" },
    ],
    suggestedQuestions: [
      "What machine-learning projects has Ahmed built?",
      "Tell me about the arrhythmia project.",
      "Does Ahmed have professional ML experience?",
    ],
  },
  {
    id: "full",
    label: "Full Profile",
    description: "The complete portfolio, with nothing emphasized.",
    lookIn: [],
    suggestedQuestions,
  },
];

export function getLensDefinition(lens: RecruiterLens): LensDefinition {
  return recruiterLenses.find((l) => l.id === lens) ?? recruiterLenses[recruiterLenses.length - 1];
}
