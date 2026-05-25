"use client";

import { SpendForm } from "./components/SpendForm";

const supportedTools = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API",
  "OpenAI API",
  "Gemini",
  "Windsurf",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/60">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <section id="how-it-works" className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up pt-2">
            <div className="premium-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Free AI spend auditor for startup teams
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Stop paying retail for the wrong AI stack.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Stacklane audits what your team pays for Cursor, Claude, ChatGPT, Copilot,
              Gemini, API usage, and more, then shows where you can downgrade,
              consolidate, or source the same capacity through discounted credits.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="premium-chip rounded-full px-4 py-2 text-sm text-foreground">
                No login before value
              </div>
              <div className="premium-chip rounded-full px-4 py-2 text-sm text-foreground">
                Built for founders and engineering managers
              </div>
              <div className="premium-chip rounded-full px-4 py-2 text-sm text-foreground">
                Shareable public report URLs
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <FeatureCard
                title="Defensible math"
                body="Every recommendation ties back to plan pricing, seat count, and use-case fit."
              />
              <FeatureCard
                title="No login wall"
                body="Users see value first, then choose whether to save or share the report."
              />
              <FeatureCard
                title="Shareable output"
                body="Each audit is designed to become a screenshot, a thread, or a forwarded link."
              />
            </div>

            <div className="mt-8 rounded-3xl border border-border bg-card/85 p-5 shadow-[0_20px_70px_-45px_rgba(0,0,0,0.35)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    What the audit catches
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">
                    Benchmarks, plan mismatch, duplicate tools, and retail pricing drag.
                  </h2>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-sm text-primary">
                  Built for founders and engineering managers
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InsightCard
                  title="Same-vendor downgrades"
                  body="Example: Team plans on tiny seat counts, or enterprise tiers bought before the company actually needed SSO and procurement controls."
                />
                <InsightCard
                  title="Equivalent alternatives"
                  body="Example: paying for a coding-first seat when the person mostly uses AI for research or writing."
                />
                <InsightCard
                  title="Spend-per-developer benchmark"
                  body="Useful context for leaders who know the bill feels high but have no baseline for what normal looks like."
                />
                <InsightCard
                  title="Credex follow-up fit"
                  body="When savings are meaningful, the audit naturally points to discounted AI credits as the next step."
                />
              </div>
            </div>

            <div className="premium-divider mt-8 grid gap-4 rounded-3xl p-5 sm:grid-cols-3">
              <SignalCard label="Focus" value="AI spend clarity" />
              <SignalCard label="Output" value="Monthly + annual savings" />
              <SignalCard label="Best fit" value="5 to 40 person startup teams" />
            </div>
          </div>

          <div id="audit-form" className="animate-fade-up lg:sticky lg:top-24" style={{ animationDelay: "0.08s" }}>
            <div className="gradient-frame rounded-[2rem] p-[1px]">
              <div className="rounded-[calc(2rem-1px)] bg-card/96 p-6 sm:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Run a free audit
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-foreground">
                      Map your current stack in under two minutes.
                    </h2>
                  </div>
                  <div className="animate-float rounded-2xl border border-primary/20 bg-primary/8 px-3 py-2 text-right">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Goal</div>
                    <div className="text-lg font-semibold text-primary">Find waste fast</div>
                  </div>
                </div>
                <SpendForm />
              </div>
            </div>
          </div>
        </section>

        <section id="supported-tools" className="mt-12 animate-fade-up" style={{ animationDelay: "0.12s" }}>
          <div className="rounded-3xl border border-border bg-card/80 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Supported in this MVP
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  Consumer seats, team plans, enterprise tiers, and direct API spend.
                </h2>
              </div>
              <div className="premium-chip rounded-full px-4 py-2 text-sm text-muted-foreground">
                8 tool families covered
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {supportedTools.map((tool, index) => (
                <div
                  key={tool}
                  className="premium-chip rounded-full px-4 py-2 text-sm text-foreground transition hover:-translate-y-0.5 hover:border-primary/40"
                  style={{ animationDelay: `${0.02 * index}s` }}
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="mt-12 animate-fade-up" style={{ animationDelay: "0.16s" }}>
          <div className="rounded-3xl border border-border bg-card/80 p-6 sm:p-8">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                FAQ
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Questions a skeptical founder or finance lead should ask
              </h2>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <FaqCard
                question="Is this just a pricing calculator?"
                answer="No. The audit compares your current spend against published pricing, seat count, minimum plan thresholds, workflow fit, and the cases where discounted credits matter more than switching vendors."
              />
              <FaqCard
                question="Do users need a login before seeing value?"
                answer="No. The audit runs first. Email capture only appears after the results are shown, which keeps the funnel aligned with the assignment and better for conversion."
              />
              <FaqCard
                question="Will the tool invent savings to push Credex?"
                answer="It should not. If the stack is already efficient or the upside is small, the results page says so directly and only offers a lighter follow-up."
              />
              <FaqCard
                question="What happens for high-savings teams?"
                answer="Those reports surface Credex more prominently because that is the point where discounted AI credits become a practical next step rather than just an interesting idea."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel-hover rounded-2xl border border-border bg-card/70 p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

function InsightCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

function FaqCard({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-5">
      <h3 className="text-base font-semibold text-foreground">{question}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
    </div>
  );
}

function SignalCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-base font-semibold text-foreground">{value}</div>
    </div>
  );
}
