# Ahmed Khan Patan — Portfolio

Personal portfolio of **Ahmed Khan Patan**, Python software engineer (backend, APIs, AWS, data workflows) and M.Sc. Computational Modeling and Simulation student at TU Dresden.

The site is statically generated: no database and no paid services. The only server code is the optional **Ask Ahmed AI** route, and the site works fully without it.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, static generation) + React 19
- TypeScript
- Tailwind CSS 4 (CSS-first config in `app/globals.css`)
- Geist / Geist Mono via `next/font`
- Lucide icons (+ two inline brand SVGs)
- Motion, used only for the nav indicator and the "How I build" pipeline
- GroqCloud (optional) for Ask Ahmed AI, called with `fetch` from a server route (no SDK)

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
  api/ask-ahmed/        Ask Ahmed AI route handler (server-only)
components/
  assistant/            Ask Ahmed AI client UI + safe answer renderer
  layout/               navbar, footer, background
  sections/             home page sections
  projects/             project flow diagram
  visuals/              hero system graph, pipeline diagram
  ui/                   small shared pieces (section, buttons, icons)
config/site.ts          name, email, social links, résumé path, site URL, portrait
data/                   all page content
lib/ai/                 AI context, system prompt, provider abstraction (server-only)
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
| Ask Ahmed AI copy and suggested questions     | `data/assistant.ts`   |

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
| `GROQ_API_KEY`         | No       | Enables Ask Ahmed AI. Server-side secret: never prefix it with `NEXT_PUBLIC_`.                 |
| `GROQ_MODEL`           | No       | Groq model ID for Ask Ahmed AI. Defaults to `openai/gpt-oss-120b`.                             |

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
5. Leave environment variables empty, or add `GROQ_API_KEY` (and optionally `GROQ_MODEL`) to enable Ask Ahmed AI. See [Ask Ahmed AI](#ask-ahmed-ai).
6. Click **Deploy**. You get a URL like `https://<project>.vercel.app`.
7. Pushes to `main` redeploy automatically, and pull requests get preview URLs.

## Ask Ahmed AI

An inline assistant section (`#ask`) that answers visitors' questions about Ahmed's experience, projects, skills and education. It uses only the content already on the site.

### Architecture

```text
components/assistant/ask-ahmed.tsx    client UI: input, suggested questions, streaming, errors
        │  POST /api/ask-ahmed  { "question": "..." }
        ▼
app/api/ask-ahmed/route.ts            validation → scope filter → rate limit → provider
        │
        ├─ lib/ai/system-prompt.ts        grounding rules + scope rules + portfolio context
        │    └─ lib/ai/portfolio-context.ts   builds the context from config/ and data/
        ├─ lib/ai/scope.ts                rejects obvious off-topic requests without calling the model
        ├─ lib/ai/rate-limit.ts           global request cap per server instance (no IPs)
        └─ lib/ai/provider.ts             picks the provider (currently Groq)
             └─ lib/ai/providers/groq.ts → providers/openai-compatible.ts (fetch + SSE streaming)
```

- **Streaming:** the route parses Groq's server-sent events and streams plain text to the browser. Only the answer `content` is forwarded; reasoning fields are never sent.
- **Server-only:** everything in `lib/ai/` (except the shared `limits.ts` and `types.ts`) imports `server-only`, so the key, prompt and context can't end up in client bundles. The page only receives one boolean: whether a key is configured.
- **Swapping providers:** the UI and route depend only on the `ChatProvider` interface (`lib/ai/types.ts`). For another OpenAI-compatible provider such as xAI, add `lib/ai/providers/xai.ts` modelled on `groq.ts` (base URL `https://api.x.ai/v1`, its own key and model env vars) and return it from `getChatProvider()`.

### Grounding

**Context.** `lib/ai/portfolio-context.ts` generates the context from the same files that render the site (`config/site.ts`, `data/*.ts`). There is no second copy of the profile, so editing `data/` updates the assistant too.

- **Factual data only.** It includes role statements, the pipeline facts, projects, skills, education and languages. Descriptive site copy (About, "Engineering in practice", "How I build") is left out on purpose: it describes typical work in general terms, and models turned it into specific claims such as "deployed with Docker via GitHub Actions".
- **One fact per line, with its scope stated.** For example, a role's technology list applies to the role as a whole. It says nothing about which tool was used for what, or for how long. Skills-list items don't establish professional use.
- **A "Not covered" list.** Per-technology durations, visa status, salary and similar don't appear anywhere, so the model says so instead of guessing.
- **Public data only.** The phone number isn't in the site data, so the model never sees it.

**Prompt.** `lib/ai/system-prompt.ts` sets numbered grounding rules:

- every claim must trace to one statement
- keep the source's verbs, nouns and number ("designed" ≠ operated; "worked with X" ≠ deployed with X)
- never merge separate facts or invent architectural relationships
- no per-technology durations
- no inferred adjacent technologies
- no seniority inflation
- claims made in the visitor's message are not facts

The rules apply identically in every language, followed by a sentence-by-sentence self-check before answering. The prompt also includes today's date, so ended roles and the ongoing M.Sc. are described correctly.

**Decoding.** Temperature 0, and `reasoning_effort: "medium"` for GPT-OSS so the self-check actually runs.

**Changing content.** If you edit `data/`, ask the assistant a few questions afterwards. New wording can introduce new ambiguity, such as adverbs or merged facts in a single bullet.

### Configuration

1. Create a free API key at [console.groq.com/keys](https://console.groq.com/keys).
2. **Locally:** create `.env.local` (it's git-ignored):
   ```bash
   GROQ_API_KEY=gsk_...
   # optional
   GROQ_MODEL=openai/gpt-oss-120b
   ```
   Restart `npm run dev`. For `npm run start`, rebuild first.
3. **On Vercel:** go to **Project → Settings → Environment Variables**, add `GROQ_API_KEY` (and optionally `GROQ_MODEL`) for Production (and Preview if wanted), then **redeploy**. The home page is static, so whether the assistant is enabled is decided at build time.
4. **Choosing a model:** set `GROQ_MODEL` to any chat model from [Groq's model list](https://console.groq.com/docs/models). The default is `openai/gpt-oss-120b`, chosen because Groq deprecated the Llama 3.x models in August 2026. For GPT-OSS models the app requests `reasoning_effort: "medium"` (needed for reliable grounding) and hides reasoning output. Other models are sent standard parameters only.
5. **Free-tier rate limits:** every question sends the full grounding prompt (roughly 3–4k tokens per question including reasoning and answer). Groq's free tier limits tokens per minute, so expect only a few questions per minute before Groq returns 429. Visitors then see the "busy" message. For a public site, consider Groq's paid Developer tier, or `openai/gpt-oss-20b` (cheaper and faster; re-check answer quality if you switch).

### Limits and safety

- **Request limits:** questions are capped at 500 characters and request bodies at 4 KB. JSON is validated server-side, and cross-site requests are rejected.
- **Answer limits:** up to 1,600 completion tokens (this includes hidden reasoning; visible answers are kept short by the prompt) and temperature 0.
- **Rate limit:** at most 30 requests per minute per server instance. This is a global counter that stores no IPs or visitor identifiers.
- **Safe rendering:** answers are plain text turned into React elements (paragraphs, lists, **bold**). Model output is never injected as HTML, and links aren't rendered.
- **Stateless:** questions and answers aren't stored or logged. Server logs only record upstream error types.

### Failure behaviour

The rest of the portfolio never depends on the assistant.

| Situation                             | What visitors see                                                        |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `GROQ_API_KEY` missing                | "Temporarily unavailable" notice in the section; input disabled          |
| Groq down, network error, invalid key | "The portfolio assistant is temporarily unavailable…"                    |
| Groq or local rate limit              | "The assistant is getting a lot of questions right now…"                 |
| Stream interrupted                    | Partial answer kept, plus "The answer was interrupted…"                  |
| Off-topic question                    | Polite reply that it only covers Ahmed's portfolio                       |

## Custom or student domain (optional, later)

1. In Vercel, open **Project → Settings → Domains** and add the domain.
2. Create the DNS records Vercel lists at your registrar (usually an `A` record for the apex and a `CNAME` for `www`).
3. After the domain verifies, go to **Settings → Environment Variables** and set `NEXT_PUBLIC_SITE_URL=https://your-domain`.
4. Redeploy so the canonical URLs, sitemap and Open Graph tags use the new domain.

## Notes

- Motion respects `prefers-reduced-motion`. Scroll reveals use CSS scroll-driven animations, so browsers without support just show the content.
- The 8-system / 2-AWS-account diagram is a conceptual illustration. It doesn't show confidential infrastructure.
- Ask Ahmed AI answers are model-generated. The assistant is instructed to stay within the site's content, but its answers can still be imperfect.
