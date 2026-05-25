# Architecture

## System Diagram

```mermaid
flowchart TD
    A[Landing page] --> B[Spend form]
    B --> C[/a?d=encoded-input/]
    C --> D[Local audit engine]
    D --> E[/api/summary]
    D --> F[/api/audits]
    E --> G[Anthropic API or fallback summary]
    F --> H[Supabase/Postgres audits table]
    H --> I[/report/[slug]]
    I --> J[Open Graph preview image]
    C --> K[Email gate after value shown]
    K --> L[/api/leads]
    L --> H
    L --> M[Resend transactional email]
```

## Data Flow

1. A cold visitor lands on `/` and selects tools, plans, seat counts, team size, use case, and current monthly spend.
2. The form persists in `localStorage` so a refresh does not wipe the draft.
3. On submit, the draft is encoded into the query string and sent to `/a`.
4. The client runs the deterministic audit engine locally to compute per-tool findings, total savings, and annualized savings.
5. The client posts the audit payload to `/api/summary`. If `ANTHROPIC_API_KEY` is present, the server requests a personalized summary from Anthropic; otherwise it returns a templated fallback.
6. The client posts the same sanitized audit to `/api/audits`, which stores a public report record in Supabase and returns a unique share slug.
7. The UI switches the share link from the ephemeral query-string version to the canonical `/report/[slug]` URL.
8. If the user wants the saved report, the email gate posts to `/api/leads`, which attaches lead data to the existing audit record and optionally sends a transactional email through Resend.
9. Public report pages render from persisted storage only and intentionally exclude private lead fields.

## Why This Stack

- Next.js App Router: It handles landing page UX, dynamic report pages, API routes, and Open Graph image generation in one deployable surface.
- TypeScript: The audit logic benefits from clear domain types because the core risk in this project is silent pricing or recommendation errors.
- Tailwind CSS v4: Fast iteration, good accessibility defaults, and enough control to create a Product Hunt-quality marketing surface without a template.
- Supabase/Postgres: Good fit for a lightweight lead-gen product because JSON payloads, dynamic reports, and simple tables are easy to model without building an entire backend first.
- Anthropic API: The brief explicitly prefers Anthropic, and the summary feature is exactly the sort of personalization task where an LLM adds value without owning the business logic.

## If This Needed 10k Audits / Day

- Move audit creation from the client-triggered POST into a more formal server workflow, with idempotency keys to avoid duplicate public reports.
- Move the current in-memory rate limiting into a shared edge-friendly store such as Upstash Redis or a provider-native rate limit service.
- Split audit records and lead records into separate tables with explicit analytics fields, source attribution, and lifecycle states.
- Cache public report reads aggressively and pre-render common Open Graph image generation work.
- Add background job processing for transactional email, enrichment, CRM sync, and lead scoring.
- Store normalized tool line items in relational tables if deeper analytics or benchmark rollups become important.
