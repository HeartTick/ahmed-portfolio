# CLAUDE.md — Ahmed Khan Patan Portfolio

## Project Purpose

Build and maintain Ahmed Khan Patan's production-ready personal portfolio website.

The portfolio should position Ahmed primarily as a:

**Python Software Engineer / Backend & API Engineer / Cloud-focused Software Engineer with AI/ML experience**

The website must be futuristic and dynamic, but professional enough for software-engineering recruiters in Germany and Europe.

---

## Required Reading Before Coding

Before implementing or modifying the portfolio, read:

1. `PORTFOLIO_MASTER_PROMPT.md`
2. `reference/Ahmed_Khan_Patan_Resume.pdf`

The master prompt contains the full product, design, content, QA, and deployment requirements.

The résumé is the **factual source of truth**.

If this file conflicts with the résumé on factual profile information, use the résumé.

If this file conflicts with `PORTFOLIO_MASTER_PROMPT.md` on implementation detail, follow the master prompt unless a newer explicit user instruction overrides it.

---

## Verified Profile

- Name: Ahmed Khan Patan
- Public location: Dresden, Germany
- Current education: M.Sc. Computational Modeling and Simulation, TU Dresden
- Professional experience: approximately 15 months
- Primary language/engineering focus: Python
- Professional themes: backend systems, REST APIs, data processing, PostgreSQL, automation, AWS/cloud systems, production debugging
- AI/ML experience: academic CNN/ML projects and AI-assisted development

Do not overstate seniority or experience.

---

## Verified Experience

ProjectXpert / Project Expert Ventures India Pvt. Ltd.

### Associate Developer
July 2025 – August 2026, Remote

Supported themes:
- Python automation and data-processing workflows
- REST APIs
- PostgreSQL-backed applications
- AWS services
- Django/Flask
- validation and structured persistence
- API integrations
- production troubleshooting
- 8-system automation pipeline across 2 AWS accounts
- Git/GitHub
- Docker
- Linux
- GitHub Actions CI/CD
- Redis
- JSON/XML processing
- Claude / GitHub Copilot assisted development

### Software Development Intern
May 2025 – June 2025, Remote

Supported theme:
- Python scripts for cleaning, transforming, validating, and processing Excel workbooks

---

## Verified Academic Projects

- IoT-Enabled Arrhythmia Classification using Deep Learning — Python, CNN, ESP32, IoT
- Phishing Website Detection using Machine Learning — Python, ML, classification

Do not invent project metrics.

---

## Required Base Stack

Unless a compatibility problem requires otherwise:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- next/font
- Lucide React or equivalent lightweight open-source icons
- Motion/Framer Motion only where useful

No database should be required.

No paid service should be required.

Primary deployment target: Vercel.

---

## Coding Principles

- Keep personal/profile content centralized in `data/` or a site config.
- Do not scatter hardcoded personal information throughout components.
- Prefer Server Components when interaction is not required.
- Use `"use client"` only when necessary.
- Keep dependencies minimal.
- Keep components reasonably focused.
- Do not create one huge `page.tsx`.
- Make mobile quality equal to desktop quality.
- Respect `prefers-reduced-motion`.
- Use semantic HTML and accessible interactions.
- Do not expose secrets or confidential company details.

---

## Content Rules

Never invent:

- metrics
- awards
- employers
- technologies
- certifications
- publications
- project results
- GitHub URLs
- LinkedIn URLs
- customer names
- performance percentages

If a URL or optional value cannot be extracted from the résumé, centralize it in configuration and flag it in the final handoff.

Do not use fake social links.

Do not publicly display the phone number by default.

Use `Dresden, Germany` as public location.

---

## Visual Direction

Aim for:

- premium dark interface
- near-black/charcoal surfaces
- restrained cyan/blue/violet accents
- crisp typography
- generous spacing
- subtle grids/glows
- architecture/data-flow visuals
- polished microinteractions
- restrained motion

Avoid:

- generic résumé templates
- excessive cyberpunk visuals
- gaming aesthetics
- fake neon overload
- constant animation
- fake proficiency bars
- fake project screenshots

---

## Professional Content Priority

When making tradeoffs, prioritize:

1. Professional experience
2. Python/backend/API/cloud capabilities
3. Concrete 8-system / 2-AWS-account automation fact
4. Academic ML projects
5. Current TU Dresden master's study
6. Skills
7. Personal/hobby details

---

## Validation Required

Before declaring completion, run the appropriate equivalents of:

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

Run the dev server when useful.

Fix errors rather than merely documenting them.

Do not claim a command passed unless it actually ran.

---

## Deployment Goal

The project must be ready for:

**GitHub → Vercel → free `*.vercel.app` URL → optional custom/student domain later**

Do not make a custom domain a prerequisite.

---

## Working Style

Do not stop after planning.

For a broad build request:

1. inspect,
2. plan briefly,
3. implement,
4. test,
5. fix,
6. polish,
7. hand off.

Make routine design decisions autonomously.

Only ask for user input when the missing information is genuinely blocking and cannot reasonably remain configurable.

---

## Final Reminder

The detailed requirements live in:

`PORTFOLIO_MASTER_PROMPT.md`

Read that file before making substantial changes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
