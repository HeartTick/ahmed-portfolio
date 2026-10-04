/** Professional experience. Wording follows the résumé; edit here only. */

/** A résumé statement. The id is a stable handle (used by Recruiter Lens); the text is what is shown. */
export type Highlight = { id: string; text: string };

export type Role = {
  id: string;
  company: string;
  companyLegal: string;
  title: string;
  start: string;
  end: string;
  /** ISO dates used for <time> elements. */
  startISO: string;
  endISO: string;
  mode: string;
  featured: boolean;
  summary: string;
  highlights: Highlight[];
  stack: string[];
};

export const experience: Role[] = [
  {
    id: "associate-developer",
    company: "ProjectXpert",
    companyLegal: "Project Expert Ventures India Pvt. Ltd.",
    title: "Associate Developer",
    start: "Jul 2025",
    end: "Aug 2026",
    startISO: "2025-07",
    endISO: "2026-08",
    mode: "Remote",
    featured: true,
    summary:
      "Backend and automation work in Python across structured files, REST APIs, PostgreSQL-backed applications and AWS services.",
    highlights: [
      {
        id: "automation-workflows",
        text: "Built Python automation and data-processing workflows spanning structured files, REST APIs, PostgreSQL-backed applications and AWS services.",
      },
      {
        id: "django-flask-services",
        text: "Developed and maintained Django and Flask services covering validation, structured persistence, API integrations and production troubleshooting.",
      },
      {
        id: "aws-automation-pipeline",
        text: "Designed an 8-system automation pipeline across 2 AWS accounts, and validated data movement with logs, database checks and end-to-end test scenarios.",
      },
      {
        id: "engineering-tooling",
        text: "Worked with Git/GitHub, Docker, Linux, GitHub Actions CI/CD, PostgreSQL, Redis and JSON/XML processing, using Claude and GitHub Copilot for AI-assisted development.",
      },
    ],
    stack: [
      "Python",
      "Django",
      "Flask",
      "REST APIs",
      "PostgreSQL",
      "Redis",
      "AWS",
      "Docker",
      "Linux",
      "GitHub Actions",
      "JSON/XML",
    ],
  },
  {
    id: "software-development-intern",
    company: "ProjectXpert",
    companyLegal: "Project Expert Ventures India Pvt. Ltd.",
    title: "Software Development Intern",
    start: "May 2025",
    end: "Jun 2025",
    startISO: "2025-05",
    endISO: "2025-06",
    mode: "Remote",
    featured: false,
    summary: "Data processing with Python scripts for Excel-based operational data.",
    highlights: [
      {
        id: "excel-processing-scripts",
        text: "Built Python scripts to clean, transform, validate and process Excel workbooks into structured operational outputs.",
      },
    ],
    stack: ["Python", "Excel data processing", "Data validation"],
  },
];

/** Phrase highlighted in the role's bullet points. */
export const pipelinePhrase = "8-system automation pipeline across 2 AWS accounts";

/** The headline fact from the Associate Developer role, used by the pipeline visual. */
export const pipelineFact = {
  systems: 8,
  accounts: 2,
  verification: ["Logs", "Database checks", "End-to-end test scenarios"],
};
