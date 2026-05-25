# Stacklane

Stacklane is a free AI spend auditor for startup founders and engineering managers who pay for tools like Cursor, Claude, ChatGPT, Copilot, Gemini, and direct API usage. It benchmarks spend, explains where a team is overpaying, and turns high-savings cases into qualified Credex leads with shareable public reports.

## Demo

- Live URL: `ADD_YOUR_DEPLOYED_URL`
- Public sample report: `ADD_YOUR_SAMPLE_REPORT_URL`

## Screenshots / Recording

- Add homepage screenshot here before submission
- Add audit results screenshot here before submission
- Add public report share page screenshot here before submission
- Optional: add a 30-second Loom or YouTube walkthrough

## Quick Start

1. Install dependencies:

```bash
npm ci
```

2. Copy environment variables:

```bash
copy .env.example .env.local
```

3. Run locally:

```bash
npm run dev
```

4. Open `http://localhost:3000`

5. Validate before shipping:

```bash
npm run lint
npm run test
npm run build
```

## Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_AUDITS_TABLE=audits

# Anthropic summary generation
ANTHROPIC_API_KEY=
ANTHROPIC_SUMMARY_MODEL=claude-sonnet-4-0

# Transactional email
RESEND_API_KEY=
RESEND_FROM_EMAIL=audit@yourdomain.com
```

## Deploy

Recommended: Vercel.

1. Create a Supabase project.
2. Run the SQL in `supabase/schema.sql`.
3. Add the environment variables above in Vercel.
4. Deploy from the repo root.
5. Create one sample report and verify the public `/report/[slug]` route renders correct Open Graph tags.

## Decisions

1. I used hardcoded audit rules instead of an LLM for pricing logic because the brief explicitly asks for defensible, finance-readable reasoning rather than fuzzy model opinions.
2. I used a server-side summary endpoint with an LLM fallback because the user-facing copy benefits from AI, but the app still needs to work when the API key is missing or Anthropic returns an error.
3. I store public report data separately from lead capture fields because the viral share URL should never expose company name or email.
4. I used a honeypot plus server-side IP rate limiting for abuse protection because it keeps the user flow frictionless while still covering the most likely spam path in an MVP.
5. I built a local file fallback for development storage while keeping the production path wired for Supabase, so the app can still be tested end-to-end in local environments without secrets.

## What Still Requires Real Submission Input

- Replace the deployed URL placeholders.
- Add real screenshots or a short recording.
- Complete `DEVLOG.md` with your actual seven-day work log.
- Replace `USER_INTERVIEWS.md` with three real conversations.
- Personalize `REFLECTION.md` if you want it to sound like you.
- Ensure your git history spans at least 5 distinct calendar days inside the assignment window.
