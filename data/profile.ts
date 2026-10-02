/** Profile copy: hero, snapshot, about, languages and interests. */

export const hero = {
  eyebrow: "M.Sc. @ TU Dresden · Dresden, Germany",
  headline: "Python Software Engineer",
  statement:
    "I build backend services, REST APIs and cloud-backed data workflows in Python, with a focus on validation, reliable persistence, observability and getting data where it needs to go.",
};

export type SnapshotItem = { label: string; value: string; detail: string };

export const snapshot: SnapshotItem[] = [
  { label: "Experience", value: "~15 months", detail: "Professional software development" },
  { label: "Focus", value: "Python backend", detail: "APIs, data processing, automation" },
  { label: "Cloud", value: "AWS", detail: "Lambda · ECS · RDS · S3 · CloudWatch" },
  { label: "Study", value: "M.Sc. TU Dresden", detail: "Computational Modeling & Simulation" },
];

export const about = {
  heading: "Software that moves data reliably",
  paragraphs: [
    "I'm a Python software engineer with about fifteen months of professional experience at ProjectXpert, where I worked on backend services, REST APIs, PostgreSQL-backed applications and automation running on AWS. Much of that work sat between systems: taking structured data in, validating it, persisting it and passing it on to the next service.",
    "One of the larger pieces of that work was an automation pipeline I designed spanning eight systems across two AWS accounts. A pipeline like that is only as trustworthy as its verification, so data movement was validated with logs, database checks and end-to-end test scenarios.",
    "I'm now starting an M.Sc. in Computational Modeling and Simulation at TU Dresden. Alongside backend work, I've built academic machine-learning projects, including CNN-based arrhythmia classification and phishing-website detection, and I'm keen to keep combining solid engineering with data and AI/ML.",
  ],
};

export const languages = [
  { name: "English", level: "Professional working proficiency" },
  { name: "German", level: "Beginner, currently learning" },
];

export const technicalInterests = ["Cloud systems", "AI/ML experimentation", "Developer tooling"];

export const hobbies = ["Badminton", "Carrom", "Travel"];
