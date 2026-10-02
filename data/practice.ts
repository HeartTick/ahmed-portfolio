/**
 * "Engineering in Practice" and "How I Build" content.
 * Representative of résumé-supported work patterns; not a disclosure of
 * any proprietary system.
 */

export type PracticeIcon =
  | "file"
  | "plug"
  | "shield"
  | "database"
  | "cloud"
  | "git"
  | "activity"
  | "wrench";

export type Practice = { title: string; icon: PracticeIcon; body: string };

export const practices: Practice[] = [
  {
    title: "Structured file processing",
    icon: "file",
    body: "Cleaning, transforming and validating Excel, JSON and XML into structured outputs.",
  },
  {
    title: "REST API integration",
    icon: "plug",
    body: "Building and consuming REST APIs with Django REST Framework and Flask.",
  },
  {
    title: "Validation first",
    icon: "shield",
    body: "Checking data at the boundary before it is persisted or passed downstream.",
  },
  {
    title: "PostgreSQL persistence",
    icon: "database",
    body: "Structured persistence in PostgreSQL-backed applications, with Redis alongside.",
  },
  {
    title: "AWS services",
    icon: "cloud",
    body: "Automation running on Lambda, ECS, RDS and S3 across AWS accounts.",
  },
  {
    title: "CI/CD",
    icon: "git",
    body: "Git-based workflows with Docker images and GitHub Actions pipelines.",
  },
  {
    title: "Logging & verification",
    icon: "activity",
    body: "Logs, database checks and end-to-end test scenarios to confirm data moved correctly.",
  },
  {
    title: "Production troubleshooting",
    icon: "wrench",
    body: "Debugging and maintaining running Django and Flask services in production.",
  },
];

export type BuildStage = {
  id: string;
  label: string;
  title: string;
  description: string;
  tools: string[];
};

export const buildStages: BuildStage[] = [
  {
    id: "understand",
    label: "Understand",
    title: "Understand the data and the systems around it",
    description:
      "Start from the inputs and the consumers: what format arrives, which systems depend on the output, and what a correct result looks like.",
    tools: ["Python", "JSON / XML", "Excel", "SQL"],
  },
  {
    id: "validate",
    label: "Validate",
    title: "Validate at the boundary",
    description:
      "Reject or flag bad data early, before it reaches persistence or another service, so failures are visible and cheap.",
    tools: ["Python", "Django REST Framework", "Flask"],
  },
  {
    id: "build",
    label: "Build API",
    title: "Build the service and its API",
    description:
      "Implement the processing logic behind a clear REST interface that other systems can integrate with.",
    tools: ["Django", "Flask", "REST", "Redis"],
  },
  {
    id: "persist",
    label: "Persist",
    title: "Persist in a structured way",
    description:
      "Store results in PostgreSQL with a schema that keeps the data queryable and checkable later.",
    tools: ["PostgreSQL", "AWS RDS", "AWS S3"],
  },
  {
    id: "deploy",
    label: "Deploy",
    title: "Ship through a repeatable pipeline",
    description:
      "Package with Docker and deploy through version-controlled CI/CD instead of manual steps.",
    tools: ["Docker", "GitHub Actions", "AWS ECS", "AWS Lambda"],
  },
  {
    id: "observe",
    label: "Observe",
    title: "Observe and verify",
    description:
      "Confirm the system does what it should using logs, database checks and end-to-end test scenarios, and debug from evidence.",
    tools: ["CloudWatch", "Logs", "DB checks", "E2E tests"],
  },
];
