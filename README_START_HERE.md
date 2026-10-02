# Claude Code Portfolio Starter

This folder contains the instruction files for building Ahmed Khan Patan's portfolio with Claude Code in VS Code.

## Files

- `CLAUDE.md` — concise repository-level instructions for Claude Code.
- `PORTFOLIO_MASTER_PROMPT.md` — full implementation specification.
- `reference/Ahmed_Khan_Patan_Resume.pdf` — résumé and factual source of truth.

## Recommended first message to Claude Code

Open this folder as the VS Code workspace and start Claude Code from this repository.

Then send:

> Read `CLAUDE.md`, `PORTFOLIO_MASTER_PROMPT.md`, and `reference/Ahmed_Khan_Patan_Resume.pdf` completely. Treat the résumé as the factual source of truth. Then inspect this workspace and build the complete portfolio described in the master prompt. Do not stop at planning: implement the site, run it, fix errors, run lint/typecheck/build, polish the responsive design, and prepare it for Vercel deployment.

## Important

Keep `CLAUDE.md` at the repository root. It is intentionally shorter than the master prompt.

After the website has been created, keep both instruction files in the repository while Claude is working on the project. You can remove the résumé source file from the repository before publishing if you prefer, as long as the public downloadable résumé is intentionally placed under `public/`.
