# Ahmed Khan Patan — Portfolio

Personal portfolio of **Ahmed Khan Patan**, Python software engineer (backend, APIs, AWS, data workflows) and M.Sc. Computational Modeling and Simulation student at TU Dresden.

The site is fully static: no database, no backend services, no paid integrations.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, static generation) + React 19
- TypeScript
- Tailwind CSS 4 (CSS-first config in `app/globals.css`)
- Geist / Geist Mono via `next/font`
- Lucide icons (+ two inline brand SVGs)
- Motion, used only for the nav indicator and the "How I build" pipeline

## Requirements

- Node.js 20.9 or newer (developed on Node 24)
- npm

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Command             | Purpose                              |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Development server                   |
| `npm run build`     | Production build                     |
| `npm run start`     | Serve the production build           |
| `npm run lint`      | ESLint (Next.js core-web-vitals + TS) |
| `npm run typecheck` | TypeScript, no emit                  |

## Project structure

```text
app/                    routes, metadata, OG image, robots, sitemap, favicon
  projects/[slug]/      project case-study pages (statically generated)
components/
  layout/               navbar, footer, background
  sections/             home page sections
  projects/             project flow diagram
  visuals/              hero system graph, pipeline diagram
  ui/                   small shared pieces (section, buttons, icons)
config/site.ts          name, email, social links, résumé path, site URL, portrait
data/                   all page content
public/                 résumé PDF and static assets
```

## Editing content

All text lives in `config/` and `data/`; components contain no personal details.

| What                                          | File                  |
| --------------------------------------------- | --------------------- |
| Name, email, links, location, contact note    | `config/site.ts`      |
| Hero, snapshot, about, languages, hobbies     | `data/profile.ts`     |
| Roles and the pipeline diagram facts          | `data/experience.ts`  |
| Academic projects and case-study pages        | `data/projects.ts`    |
| Skill groups                                  | `data/skills.ts`      |
| Education                                     | `data/education.ts`   |
| "Engineering in practice" + "How I build"     | `data/practice.ts`    |

Adding a project: append an entry to `data/projects.ts`. Its page at `/projects/<slug>` and sitemap entry are generated automatically. Add `links` only for URLs that really exist; the Links block is hidden when empty. To give it flow-diagram icons, add the slug to `iconsBySlug` in `components/projects/flow-diagram.tsx`.

## Replacing the résumé

Overwrite `public/Ahmed_Khan_Patan_Resume.pdf` with the new file (same name). If you rename it, update `resumePath` in `config/site.ts`.

> The public PDF includes the phone number from the original résumé. The website itself never displays it. Use a version without the number if you'd rather not publish it.

## Adding a portrait or images

- **Portrait:** put the image in `public/images/` (e.g. `public/images/portrait.jpg`) and set `portrait: "/images/portrait.jpg"` in `config/site.ts`. Until then an initials monogram is shown.
- **Project images:** put real screenshots or photos in `public/projects/`. Don't present illustrative mockups as real screenshots.

## Environment variables

None are required. See `.env.example`.

| Variable               | Required | Purpose                                                                                       |
| ---------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Canonical base URL for metadata, sitemap and OG tags. Set it once a custom domain is attached. |

When the variable isn't set, the site URL comes from Vercel's `VERCEL_PROJECT_PRODUCTION_URL` (set automatically), and `http://localhost:3000` is used locally.

## Deploying to Vercel (free tier)

1. Create a GitHub repository and push the project:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-account>/<repo>.git
   git push -u origin main
   ```
2. Sign in to [vercel.com](https://vercel.com) with GitHub (the Hobby plan is free).
3. Click **Add New → Project** and import the repository.
4. Check that the Framework Preset says **Next.js**. Leave the build and output settings at their defaults.
5. Leave environment variables empty.
6. Click **Deploy**. You get a URL like `https://<project>.vercel.app`.
7. Pushes to `main` redeploy automatically, and pull requests get preview URLs.

## Custom or student domain (optional, later)

1. In Vercel, open **Project → Settings → Domains** and add the domain.
2. Create the DNS records Vercel lists at your registrar (usually an `A` record for the apex and a `CNAME` for `www`).
3. After the domain verifies, go to **Settings → Environment Variables** and set `NEXT_PUBLIC_SITE_URL=https://your-domain`.
4. Redeploy so the canonical URLs, sitemap and Open Graph tags use the new domain.

## Notes

- Motion respects `prefers-reduced-motion`. Scroll reveals use CSS scroll-driven animations, so browsers without support just show the content.
- The 8-system / 2-AWS-account diagram is a conceptual illustration. It doesn't show confidential infrastructure.
