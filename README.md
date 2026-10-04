# Ahmed Khan Patan — Portfolio

Personal portfolio of **Ahmed Khan Patan**, Python software engineer (backend, APIs, AWS, data workflows) and M.Sc. Computational Modeling and Simulation student at TU Dresden.

The site is statically generated and needs no paid services. All portfolio content stays in local files (`config/`, `data/`).

Supabase is an optional enhancement layer used by two server routes:
- the **contact form**
- the **Ask Ahmed AI** usage quotas

If Supabase is missing or down, the portfolio still renders and works normally.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, static generation) + React 19
- TypeScript
- Tailwind CSS 4 (CSS-first config in `app/globals.css`)
- Geist / Geist Mono via `next/font`
- Lucide icons (+ two inline brand SVGs)
- Motion, used only for the nav indicator and the "How I build" pipeline
- GroqCloud (optional) for Ask Ahmed AI, called with `fetch` from a server route (no SDK)
- Supabase Postgres (optional) for contact inquiries and AI quotas, called with `fetch` from server routes (no SDK)

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
  api/contact/          contact form route handler (server-only)
components/
  assistant/            Ask Ahmed AI client UI + safe answer renderer
  contact/              contact form (client)
  layout/               navbar, footer, background
  sections/             home page sections
  projects/             project flow diagram
  visuals/              hero system graph, pipeline diagram
  ui/                   small shared pieces (section, buttons, icons)
config/site.ts          name, email, social links, résumé path, site URL, portrait
data/                   all page content
lib/ai/                 AI context, system prompt, provider abstraction (server-only)
lib/supabase/server.ts  server-only Supabase RPC helper
lib/session.ts          anonymous session cookie + hashing (server-only)
lib/usage-limits.ts     configurable daily limits (server-only)
lib/contact/            contact validation shared by browser and server
supabase/migrations/    SQL migrations (tables, functions, RLS, grants)
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
| Contact form copy                             | `data/contact.ts`     |

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
| `SUPABASE_URL`         | No\*     | Supabase project URL. Enables the contact form and AI quotas. Server-only.                     |
| `SUPABASE_SECRET_KEY`  | No\*     | Supabase secret key (`sb_secret_…`). Server-side secret: never prefix it with `NEXT_PUBLIC_`.  |
| `AI_DAILY_SESSION_LIMIT` | No     | Ask Ahmed AI questions per browser per UTC day. Default `5`.                                   |
| `AI_GLOBAL_DAILY_LIMIT`  | No     | Ask Ahmed AI questions across all visitors per UTC day. Default `40`.                          |
| `CONTACT_DAILY_SESSION_LIMIT` | No | Successful contact submissions per browser per UTC day. Default `3`.                          |
| `AI_QUOTA_DEV_BYPASS`  | No       | `true` lets Ask Ahmed AI run without Supabase on `npm run dev` only. Ignored in production.   |

\* Ask Ahmed AI requires Supabase as well as `GROQ_API_KEY`: in production it refuses to call Groq without quota protection.

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
5. Leave environment variables empty, or add the [Supabase](#supabase-contact-form-and-ai-quotas) variables (contact form) plus `GROQ_API_KEY` (Ask Ahmed AI).
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
- **Burst limit:** at most 30 requests per minute per server instance (in memory, no identifiers).
- **Daily quotas:** per browser and site-wide, stored in Supabase. See [Supabase](#supabase-contact-form-and-ai-quotas).
- **Safe rendering:** answers are plain text turned into React elements (paragraphs, lists, **bold**). Model output is never injected as HTML, and links aren't rendered.
- **Stateless:** questions and answers aren't stored or logged. Server logs only record upstream error types.

### Failure behaviour

The rest of the portfolio never depends on the assistant.

| Situation                             | What visitors see                                                        |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `GROQ_API_KEY` or Supabase missing    | "Temporarily unavailable" notice in the section; input disabled          |
| Groq down, network error, invalid key | "The portfolio assistant is temporarily unavailable…" (quota refunded)   |
| Supabase down (quota can't be verified) | "Temporarily unavailable…"; Groq is **not** called (fails closed)       |
| Daily limit reached (browser or site) | "You've reached today's portfolio AI limit…"; input disabled             |
| Groq or local rate limit              | "The assistant is getting a lot of questions right now…"                 |
| Stream interrupted                    | Partial answer kept, plus "The answer was interrupted…"                  |
| Off-topic question                    | Polite reply that it only covers Ahmed's portfolio                       |

## Supabase: contact form and AI quotas

Supabase Postgres stores two things: contact-form inquiries, and anonymous daily usage counters for Ask Ahmed AI. Portfolio content is **not** stored there.

### Setup

1. **Create a project** at [supabase.com/dashboard](https://supabase.com/dashboard): **New project**. Pick a region near your visitors (e.g. Frankfurt, `eu-central-1`) and save the database password somewhere safe.
2. **Find the project URL:** **Project Settings → Data API** (or the **Connect** button at the top). It looks like `https://<project-ref>.supabase.co`.
3. **Get a secret key:** **Project Settings → API Keys → Secret keys**. Create a secret key named e.g. `portfolio-server` (or reveal the default one) and copy it (`sb_secret_…`).
   - Never use it in browser code or a `NEXT_PUBLIC_` variable.
   - The legacy `service_role` JWT also works, but Supabase is phasing legacy keys out.
4. **Run the migration:** **SQL Editor → New query**, paste the full contents of `supabase/migrations/20261003000000_contact_inquiries_and_usage_limits.sql`, and click **Run**. It should finish with "Success. No rows returned".
   - Alternatively, with the CLI: `npx supabase link --project-ref <project-ref>` then `npx supabase db push`.
5. **Configure `.env.local`:**
   ```bash
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_...
   GROQ_API_KEY=gsk_...
   # optional, defaults shown
   AI_DAILY_SESSION_LIMIT=5
   AI_GLOBAL_DAILY_LIMIT=40
   CONTACT_DAILY_SESSION_LIMIT=3
   ```
6. **Restart** `npm run dev` (environment files are read at startup). For `npm run start`, run `npm run build` again: the home page is static, so it decides at build time whether to show the form and the assistant.
7. **Test the contact form:** send a message on the home page.
   - It appears in **Table Editor → `contact_inquiries`** with status `new`.
   - Submitting more than `CONTACT_DAILY_SESSION_LIMIT` times from one browser shows the daily-limit message.
8. **Test AI quotas:** ask questions until the per-browser limit is reached.
   - **Table Editor → `ai_usage_daily`** shows one row per browser per day (a hash, the date, a count).
   - **`ai_usage_global_daily`** shows the site-wide total.
   - Set `AI_DAILY_SESSION_LIMIT=2` temporarily to test quickly.
9. **Add the variables in Vercel:** **Project → Settings → Environment Variables**. Add `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `GROQ_API_KEY`, and optionally the limit variables, for Production (and Preview if wanted).
10. **Redeploy:** **Deployments → … → Redeploy**, or push a commit. A redeploy is needed because the home page is built statically.

### Managing inquiries

Open **Table Editor → `contact_inquiries`**. Change `status` from `new` to `read` or `archived` by editing the cell. `updated_at` is set automatically, and any other status value is rejected. There is no custom admin UI yet.

### Security design

- **Server-only access:** browsers never talk to Supabase.
  - `/api/contact` and `/api/ask-ahmed` call Postgres functions through Supabase's REST API with the secret key, sent in the `apikey` header as Supabase recommends.
  - The key is read only by `lib/supabase/server.ts`, which imports `server-only`, so the build fails if a client component imports it. It never appears in browser JavaScript.
- **RLS on every table, with no policies:** `anon` and `authenticated` (publishable key, signed-in users) can neither read nor write any row. The secret key maps to `service_role`, which bypasses RLS.
- **Revoked grants (defence in depth):** all table and function privileges are revoked from `public`, `anon` and `authenticated`. Only `service_role` may use the tables and execute the functions. Even an accidental future `grant select … to anon` would return no rows, because RLS still applies.
- **Functions only, no ad-hoc SQL:** the app never builds SQL. It calls three functions with typed JSON arguments:
  - `submit_contact_inquiry`
  - `consume_ai_quota`
  - `refund_ai_quota`

  They run with `security invoker` and an empty `search_path`. Column `CHECK` constraints re-validate lengths, email format and status values inside the database.
- **Opaque errors:** database errors are logged server-side as a status and code only. Visitors only ever see generic messages.

### Anonymous session (abuse protection only)

- **Identifier:** on the first contact or AI request, the server creates 32 cryptographically random bytes and stores them in a `portfolio_session` cookie.
- **Cookie flags:** `HttpOnly`, `SameSite=Lax`, `Path=/api`, `Secure` in production, and a fixed 30-day lifetime that isn't renewed on use.
- **Not tracking:** the identifier isn't derived from IP addresses, user agents or any fingerprinting, and it's used for nothing except rate limits.
- **Hashed before storage:** the database only ever receives `SHA-256("portfolio_session:v1:" + id)` as a 64-character hex string. Because the id is 256 bits of randomness, the hash can't be reversed or guessed. The raw cookie value is never stored or logged.
- **Clearing cookies resets the per-browser limits.** That's why a site-wide daily limit exists as a second layer.

### Quota algorithm

`consume_ai_quota(session_hash, session_limit, global_limit)` runs as a single transaction:

1. Ensures today's site-wide row exists (UTC date) and locks it with `SELECT … FOR UPDATE`.
2. Ensures the browser's row for today exists and locks it.
3. If either count is at its limit, returns `allowed = false` with `session_limit` or `global_limit`.
4. Otherwise increments both counters and returns `allowed = true` plus the questions remaining for that browser.

Row locks serialize concurrent requests, so parallel requests can't bypass a limit through a read-then-write race. Locks are always taken in the same order (global row, then browser row), so they can't deadlock.

The route's order is: validate → off-topic filter → burst limiter → session → quota → Groq. Off-topic and invalid requests never consume quota. If Groq fails before answering, `refund_ai_quota` gives the request back. Contact submissions use the same pattern in `submit_contact_inquiry`, and only successful submissions are counted.

The first request of each day prunes old rows: per-browser counters after 7 days, site-wide totals after 90 days.

### What is stored

| Table                   | Columns                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| `contact_inquiries`     | `id`, `name`, `email`, `company` (optional), `message`, `status`, `created_at`, `updated_at` |
| `contact_usage_daily`   | `session_hash`, `usage_date`, `submission_count`, `created_at`, `updated_at` |
| `ai_usage_daily`        | `session_hash`, `usage_date`, `request_count`, `created_at`, `updated_at` |
| `ai_usage_global_daily` | `usage_date`, `request_count`, `created_at`, `updated_at`               |

**Not stored:** IP addresses, user agents, AI questions or answers, conversation history, raw session identifiers, fingerprints, phone numbers.

### Contact spam protection

The protection is lightweight, with no CAPTCHA:

- a hidden honeypot field (bots that fill it get a fake success, and nothing is stored)
- a minimum completion time of 3 seconds after the first interaction with the form
- a 12 KB request-body limit
- server-side validation of an allow-listed set of fields
- the per-browser daily limit

### Failure behaviour

| Situation                                | Contact form                                                       | Ask Ahmed AI                                  |
| ---------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------- |
| Supabase env vars missing at build time  | Notice with the direct email address instead of the form           | Shown as unavailable (unless dev bypass)      |
| Supabase down or erroring at runtime     | "Couldn't be sent right now…" + direct email link; typed text kept | "Temporarily unavailable"; Groq not called    |
| Daily limit reached                      | Limit message + direct email link                                  | Limit message; input disabled                 |

Everything else keeps working in all of these cases: static content, navigation, project pages and the résumé download.

**Local development without Supabase:** set `AI_QUOTA_DEV_BYPASS=true` in `.env.local` to try Ask Ahmed AI on `npm run dev` without quotas. The bypass is only honoured when `NODE_ENV=development`. `next build`, `next start` and Vercel always run in production mode, so it can't leak into a deployment.

## Custom or student domain (optional, later)

1. In Vercel, open **Project → Settings → Domains** and add the domain.
2. Create the DNS records Vercel lists at your registrar (usually an `A` record for the apex and a `CNAME` for `www`).
3. After the domain verifies, go to **Settings → Environment Variables** and set `NEXT_PUBLIC_SITE_URL=https://your-domain`.
4. Redeploy so the canonical URLs, sitemap and Open Graph tags use the new domain.

## Notes

- Motion respects `prefers-reduced-motion`. Scroll reveals use CSS scroll-driven animations, so browsers without support just show the content.
- The 8-system / 2-AWS-account diagram is a conceptual illustration. It doesn't show confidential infrastructure.
- Ask Ahmed AI answers are model-generated. The assistant is instructed to stay within the site's content, but its answers can still be imperfect.
