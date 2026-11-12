# Emakings AI

A responsive marketing website and relationship companion MVP for **emakings.site**. Original dark violet product design, inspired by LovePing’s presentation style. Built in an initially empty repository.

## Stack

Next.js App Router, TypeScript, React, custom responsive CSS, Lucide icons, Supabase Auth/Postgres, Zod validation, and a server-only OpenAI-compatible AI adapter. Product previews are original HTML/CSS/SVG, with reduced-motion support and no stock assets. Vercel is the deployment target; this is not a Cloudflare Sites deployment.

## Local development

Install Node.js 22 LTS or newer, then:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. No credentials are needed for the homepage, template assistant, or `/dashboard?demo=1`. Never put private information into the local demo: it uses browser localStorage, not authentication. No notification service is implemented.

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Routes and working behavior

- `/`: all twelve brief sections, responsive navigation, original product mockups, interactive sample generator, and waitlist form.
- `/signup`, `/login`, `/auth/callback`: Supabase email/password signup, confirmation, sign-in, persisted browser session, sign-out.
- `/dashboard`: private workspace overview; the browser verifies the session and APIs verify the bearer token with Supabase before reading private records.
- `/dashboard/people`: create, edit, delete profiles, an important date, interests, and notes.
- `/dashboard/reminders`: create, edit, complete, reopen, and delete dated reminders. Times are local wall-clock values; **no email, SMS, or push delivery**.
- `/dashboard/ai-assistant`: validated live AI generation, structured results, copy message, and history (on by default, controllable in Settings).
- `/dashboard/insights`: transparent, deterministic workspace summaries and general suggestions; advanced AI insights are planned.
- `/dashboard/settings`: display name, generation-history preference, JSON export, and account deletion.
- `/privacy`, `/terms`, `/contact`: accurate pre-launch information, with missing operator details disclosed.

Every dashboard route supports `?demo=1`, a separate browser-local sample workspace. It is not a sign-in bypass: no authenticated server data is fetched in demo mode, and live AI requires a verified account. Sample generation is labelled and uses local templates; failures in the live provider never fall back to samples.

## Environment

| Variable                        | Purpose                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`          | Canonical origin, `http://localhost:3000` locally or `https://emakings.site` in production |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project HTTPS URL                                                                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable/legacy anon project key; RLS applies                                           |
| `SUPABASE_SERVICE_ROLE_KEY`     | **Server only**; waitlist, atomic rate limiting, account deletion                          |
| `AI_BASE_URL`                   | HTTPS OpenAI-compatible API base ending in `/v1`; adapter appends `/chat/completions`      |
| `AI_API_KEY`                    | **Server only** provider credential                                                        |
| `AI_MODEL`                      | Model ID supported by your chosen endpoint                                                 |
| `AI_PROVIDER_LABEL`             | Reserved for deployment/provider identification; finalize disclosures before launch        |

Only `NEXT_PUBLIC_*` values reach the client. Never prefix provider or service-role credentials with `NEXT_PUBLIC_`. Restart/rebuild after changing public variables. There is no bundled API key or configured production backend.

## Supabase setup

1. Create a Supabase project. Apply `supabase/migrations/202611110001_initial.sql` in its SQL editor, or link the Supabase CLI and run `supabase db push`. Apply once to a new database.
2. Set the Supabase URL, anon key, and server service-role key in `.env.local` / Vercel.
3. Enable email/password authentication and email confirmation. Configure an appropriate production SMTP sender and a minimum password length of 12.
4. In Auth URL Configuration set Site URL to `https://emakings.site`. Allow `https://emakings.site/auth/callback` and the exact local development callback. Add exact Vercel preview callbacks for environments you control; do not broadly wildcard production redirects.
5. The signup trigger initializes `profiles` and `user_preferences`. `auth.users` is the user table; the important date is stored directly on `relationships` for this MVP. Separate event tables can be added when multiple recurring dates are supported.
6. RLS scopes all private records to `auth.uid()`. Account deletion cascades through records. Public roles cannot read or write waitlist/rate-limit tables. The service-role key must remain on the server.
7. Validate with two test accounts: create records as A, try to select/update/delete them using B’s Supabase token, and verify no records are returned/changed. Check confirmation callbacks, sign-out, expired sessions, and account deletion against the real project before launch.

The app uses a browser-stored Supabase session and bearer-authenticated API routes rather than cookie-based SSR authentication. Private data is fetched only after verification; it is never embedded in server-rendered HTML. Dashboard navigation redirects unauthenticated visitors to login. API authorization is enforced independently.

## AI configuration and architecture

`lib/ai.ts` contains a provider adapter with an OpenAI-compatible chat completions contract. It sends only the form’s explicit context, not the user’s whole workspace. Configure an endpoint, model ID, and API key that support ordinary chat completion JSON text. The system prompt requests a message, three gifts, a gesture, and a follow-up. Zod validates the returned structure before display or persistence. The selected category filters the visible output. There are no invented product links or purchase recommendations with asserted availability.

- 30-second timeout; explicit upstream errors; no fabricated fallback.
- Input limits and server-side validation.
- Distributed atomic Postgres rate limiting: 20 AI calls/user/hour; public waitlist 5/hour per Vercel-supplied IP (shared fallback outside Vercel), 100/hour globally. Missing rate-limit infrastructure fails closed.
- Generation history stores validated output, occasion, category, account ID, and timestamp; full interests/context are not stored in the log. Do not add sensitive request bodies to application logs.
- Prompt instructions reduce injection risks but are not a security boundary. Outputs are plain React text; never render generated HTML.
- Existing saved suggestions can be individually deleted. Disabling history stops future output persistence.

## AI development roadmap

Current: context assembly → validated prompt → configurable provider → structured recommendation → user action.

Planned: retrieval-based personalization, consented evaluation sets, compatible model-serving endpoints, and inference optimization. Evaluate response relevance, latency, throughput, and cost before selecting infrastructure. Do not present roadmap items as implemented functionality.

## Vercel deployment and custom domain

1. Push this repository to your Git provider and import it into a Vercel project. Select Next.js, Node 22+, default `npm run build`, and the repository root.
2. Configure production environment variables in Vercel. Use separate Supabase and AI projects/keys for preview environments if needed. Redeploy after setting public variables.
3. Apply the Supabase migration, verify Auth settings, and configure the actual model provider. Check `/api/waitlist` with a controlled test address and confirm the persisted database row.
4. Add `emakings.site` and, if desired, `www.emakings.site` in Vercel Domains. Apply the **exact DNS records Vercel returns** at your registrar; do not guess IP addresses. Redirect the secondary hostname to the canonical origin.
5. Wait for domain verification and TLS provisioning. Verify HTTPS, canonical metadata, callback URLs, authenticated CRUD, waitlist, rate limits, provider failures, account isolation, deletion, and mobile behavior.
6. Review security headers. CSP currently allows Next.js inline scripts and development eval; use a per-request nonce strategy before tightening it for production. If using a custom Supabase domain, add that exact domain to `connect-src`.

This repository is deployment-prepared, not deployed. No Vercel account, DNS access, Supabase project, production credentials, were supplied. Do not claim the custom domain is live based on a local build.

## Required public-launch information

- Real founder name, portrait, and approved biography. The founder’s LinkedIn is https://www.linkedin.com/in/kolawole-ni-mat-2997a154/.
- Legal operator identity, jurisdiction, data-processing providers and locations, age eligibility, retention/backup schedule, and reviewed privacy/terms.
- Replace the pre-launch policies, define waitlist deletion handling, and verify provider data terms.
- General social media links are removed. Contact: mat@emakings.site · +2349076234742.

No testimonials, customer logos, user counts, team members, certifications, or operational achievements are invented.

## Verification and limits

Verified locally: optimized production build and TypeScript checks pass; 10 unit tests and 10 Playwright browser tests pass across desktop Chrome and an iPhone-sized Chromium viewport. Browser checks exercise sample generation, honest unconfigured waitlist errors, profile and reminder CRUD/persistence, completion/reopening, settings, the account guard, public routes, metadata assets, navigation, and horizontal overflow. Screenshots are generated under ignored `test-results/`.

To reproduce browser checks, build and start the app on `http://127.0.0.1:3000`, then run `npm run test:browser` in another terminal. The config uses installed macOS Chrome when present; elsewhere run `npx playwright install chromium` or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to your Chrome executable. Browser tests assume no service credentials, so they can verify the explicit unconfigured state. These tests do not substitute for live Supabase/provider validation.

Unit tests cover input validation, structured AI output, sample behavior, absent credentials, authorization requirements, cross-origin rejection, date/time validation, and waitlist validation. A production build checks all routes and TypeScript. Live Supabase and provider integration tests require real credentials and must be completed before launch. Export currently includes up to 500 loaded records per category; add pagination and a complete server export for larger accounts. Annual recurrence, timezone-aware delivered notifications, forgotten-password recovery, file storage, and advanced relationship insights are not implemented.
