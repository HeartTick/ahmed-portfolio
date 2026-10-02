/** Categorised skills. No proficiency percentages, by design. */

export type SkillIcon = "server" | "database" | "cloud" | "git" | "brain";

export type SkillGroup = {
  id: string;
  title: string;
  icon: SkillIcon;
  description: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "backend",
    title: "Backend & APIs",
    icon: "server",
    description: "Services, integrations and the validation around them.",
    skills: ["Python", "Django REST Framework", "Flask", "REST APIs", "Data validation", "Data integration"],
  },
  {
    id: "data",
    title: "Data",
    icon: "database",
    description: "Structured persistence and file-based data processing.",
    skills: ["SQL", "PostgreSQL", "Redis", "JSON / XML", "Excel data processing"],
  },
  {
    id: "cloud",
    title: "Cloud",
    icon: "cloud",
    description: "AWS services used for automation and hosting workloads.",
    skills: ["AWS Lambda", "AWS ECS", "AWS RDS", "AWS S3", "AWS CloudWatch"],
  },
  {
    id: "engineering",
    title: "Engineering",
    icon: "git",
    description: "Tooling for shipping and running code.",
    skills: ["Git", "GitHub", "Docker", "Linux", "GitHub Actions", "CI/CD"],
  },
  {
    id: "ai-ml",
    title: "AI / ML",
    icon: "brain",
    description: "Academic ML work and AI-assisted development.",
    skills: ["CNN classification", "Machine learning", "Claude", "GitHub Copilot"],
  },
];
