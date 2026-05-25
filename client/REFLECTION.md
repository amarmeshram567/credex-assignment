# Reflection

The prompts below are intentionally left as strong starter drafts, not fake autobiography. Replace or personalize anything that does not reflect your actual week.

## 1. The hardest bug you hit this week, and how you debugged it

The hardest bug was the gap between a good-looking prototype and a real report flow that could survive production constraints. The UI was already rendering audit results, but several assumptions underneath it were fake: lead capture only existed in `localStorage`, share links were just encoded query strings, and the personalized summary path never actually went through a server-side API. The symptoms were subtle because the app still looked polished, which made it tempting to defer the infrastructure work. I treated that as a debugging problem instead of a feature problem: what exactly would break the moment a stranger on Product Hunt used this? I traced each path from the result page backward and listed the hard failure points: no persistent report, no private/public data separation, no email confirmation, and no backend validation.

I then tackled the flow one dependency at a time. First, I built a report persistence layer and forced the result page to request a canonical report URL. That surfaced the server/client boundary problem immediately because my result components were not marked as client components and failed during build. After that was fixed, I wired lead capture through a route handler and made the email step optional based on environment variables, which let the app behave correctly in local development. The lesson was that a polished front end can mask architectural bugs. What finally worked was following the user journey end to end and refusing to accept a “looks done” state if the underlying action was still simulated.

## 2. A decision you reversed mid-week, and what made you reverse it

The decision I reversed was treating the share URL as purely client-side encoded state. Early on, this felt elegant because it avoided backend complexity. The user could fill in the form, land on `/a?d=...`, and instantly get a shareable result without waiting on a database. That approach is fine for a throwaway demo, but the brief is very explicit that this should be something Credex could plausibly launch. Once I read the assignment with that lens, the trade-offs became unacceptable. A client-only share link gives you no durable report, no way to attach a lead to the existing audit, no clean Open Graph preview, and no analytics around which audits actually get shared or captured.

I reversed the decision and added a server-side persistence path. The client still computes the audit immediately for speed, but it now persists a sanitized public record and upgrades the share link to a canonical `/report/[slug]` page. That change also forced cleaner separation of concerns: the public report stores tool lines, results, and summary, while private lead data is attached later. Reversing the decision improved the app far beyond just “meeting the requirement.” It made the product feel more like a real wedge for a viral lead-gen loop instead of a neat front-end trick.

## 3. What you would build in week 2 if you had it

If I had a second week, I would focus on turning Stacklane from a polished calculator into a defensible growth system. The first addition would be analytics and attribution: where completed audits came from, how many users copied or shared report links, and which tool combinations correlate with the strongest Credex-fit opportunities. Right now the app can generate and persist reports, but it is not yet instrumented like a proper acquisition funnel. The second addition would be a benchmark engine based on real usage distributions instead of heuristic bands. The existing benchmark mode is useful, but in week two I would want actual cohort logic by team size, use case, and tool mix.

I would also add a true operator workflow for Credex. High-savings leads should flow into a lightweight review queue with statuses like `new`, `contacted`, `qualified`, and `closed won`. That would make it much easier to prove whether the tool actually drives revenue. Finally, I would add a PDF export and a small embeddable widget. Those two features would turn the product from a single landing page into an asset that can spread through newsletter sponsorships, founder communities, and partner content. Week one should prove that the audit is useful. Week two should prove that the distribution loop compounds.

## 4. How you used AI tools

I used AI primarily as a pairing tool, not as an authority. It helped me move faster on UI iteration, code scaffolding, refactors, and brainstorming phrasing for the landing page and summary feature. It was especially helpful for converting a loose product brief into concrete implementation slices: result persistence, public share pages, lead capture routes, and documentation structure. I also used AI to pressure-test the audit copy and make sure the tone stayed closer to an operator or finance reviewer than a hype-driven marketing page.

What I did not trust AI with was pricing accuracy, product requirements interpretation, or final audit math. Those are exactly the areas where a subtle hallucination would make the whole submission weaker. One specific time the AI was wrong was around pricing assumptions for enterprise plans. The earlier version of the codebase had invented clean per-seat numbers for plans that are actually custom-priced or usage-based. That looked tidy in code but was not defensible against the brief’s requirement that every number map back to an official pricing source. Catching that forced me to rework the pricing model and documentation so custom-priced plans were handled honestly rather than flattened into fake certainty.

## 5. Self-rating

**Discipline: 7/10**  
I stayed focused on the product path that mattered, but the repo still needs honest daily logs and real interview notes before it is truly submission-ready.

**Code quality: 7/10**  
The code is structured and typed well enough to build on, but a second pass could improve validation, analytics, and adapter boundaries around external services.

**Design sense: 8/10**  
The current UI feels much more intentional than a starter template and has a shareable results surface, which matters a lot for this brief.

**Problem-solving: 8/10**  
The strongest move was recognizing that several “working” features were only simulated and then rebuilding them around a more realistic flow.

**Entrepreneurial thinking: 7/10**  
The app is positioned as a lead-gen wedge instead of a generic calculator, but the biggest entrepreneurial proof point still comes from real interviews and actual distribution.
