"use client";

import { useState } from "react";
import { EmailGate } from "@/components/EmailGate";
import type { AuditInput, AuditResult, BenchmarkInsight, LineFinding } from "@/lib/audit";
import { getBenchmarkInsight } from "@/lib/audit";
import { TOOLS_BY_ID } from "@/lib/pricing";

const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const severityStyle: Record<LineFinding["severity"], string> = {
    high: "border-primary/30 bg-primary/5",
    medium: "border-accent/25 bg-accent/5",
    low: "border-border bg-card",
    ok: "border-border bg-card",
};

const severityChip: Record<LineFinding["severity"], string> = {
    high: "bg-primary/12 text-primary",
    medium: "bg-accent/12 text-accent-foreground",
    low: "bg-muted text-muted-foreground",
    ok: "bg-muted text-muted-foreground",
};

export function AuditResults({
    input,
    result,
    summary,
    shareUrl,
    auditSlug,
    hideLeadCapture,
}: {
    input: AuditInput;
    result: AuditResult;
    summary: string;
    shareUrl: string;
    auditSlug?: string;
    hideLeadCapture?: boolean;
}) {
    const [copied, setCopied] = useState(false);
    const benchmark = getBenchmarkInsight(input, result);
    const copy = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <section className="surface-card panel-hover animate-fade-up relative overflow-hidden p-8 sm:p-10">
                <div className="hero-orb absolute -right-20 -top-20 h-56 w-56 rounded-full" />
                <div className="hero-orb absolute bottom-0 left-0 h-44 w-44 rounded-full opacity-60" />
                <div className="grid-bg absolute inset-0 opacity-50" />

                <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
                    <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                            Instant AI spend audit
                        </p>
                        {result.optimal ? (
                            <>
                                <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                    Your stack is already disciplined.
                                </h1>
                                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                                    We did not find material waste. Your team is spending{" "}
                                    <span className="font-mono text-foreground">{fmt(result.totalCurrent)}/month</span>
                                    {" "}on tools that broadly fit the way you work today.
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                    You can reclaim{" "}
                                    <span className="text-gradient-savings">{fmt(result.totalSaved)}/month</span>
                                    {" "}without disrupting the team.
                                </h1>
                                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                                    This audit found plan-fit issues, overlapping spend, or retail pricing that
                                    can be corrected while keeping the workflows your team already relies on.
                                </p>
                            </>
                        )}

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <MetricCard label="Current spend" value={fmt(result.totalCurrent)} />
                            <MetricCard label="Optimized spend" value={fmt(result.optimizedSpend)} accent />
                            <MetricCard label="Annual upside" value={fmt(result.totalAnnualSaved)} accent />
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                onClick={copy}
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card"
                            >
                                {copied ? "Link copied" : "Copy public report"}
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" />
                                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                                </svg>
                            </button>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                    result.optimal
                                        ? `Ran an AI spend audit and our stack already looks right-sized. ${shareUrl}`
                                        : `Ran an AI spend audit and found ${fmt(result.totalSaved)}/month in possible savings. ${shareUrl}`,
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card"
                            >
                                Share on X
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <BenchmarkCard benchmark={benchmark} />
                        <WaterfallCard result={result} />
                    </div>
                </div>
            </section>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.85fr]">
                <div className="space-y-8">
                    <section className="surface-card animate-fade-up p-6" style={{ animationDelay: "0.05s" }}>
                        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
                            </svg>
                            Personalized summary
                        </div>
                        <p className="text-[15px] leading-7 text-foreground/90">{summary}</p>
                    </section>

                    <section className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Per-tool breakdown</h2>
                                <p className="text-sm text-muted-foreground">
                                    Every recommendation ties current spend to a lower-cost option or a no-change decision.
                                </p>
                            </div>
                            <div className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                                {result.findings.length} tools reviewed
                            </div>
                        </div>
                        <div className="space-y-3">
                            {result.findings.map((finding) => {
                                const tool = TOOLS_BY_ID[finding.toolId];
                                return (
                                    <article
                                        key={finding.toolId}
                                        className={`panel-hover rounded-2xl border p-5 transition duration-200 ${severityStyle[finding.severity]}`}
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="max-w-2xl">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-base font-semibold text-foreground">
                                                        {finding.toolName}
                                                    </h3>
                                                    <span className="text-sm text-muted-foreground">
                                                        {finding.planName} · {finding.seats} seat{finding.seats > 1 ? "s" : ""}
                                                    </span>
                                                    <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wide ${severityChip[finding.severity]}`}>
                                                        {finding.severity === "ok" ? "Right-sized" : `${finding.severity} opportunity`}
                                                    </span>
                                                </div>
                                                <p className="mt-3 text-sm font-medium text-foreground">
                                                    {finding.recommendedAction}
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                    {finding.reason}
                                                </p>
                                                {tool && (
                                                    <a
                                                        href={tool.pricingUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground underline decoration-dotted underline-offset-4 transition hover:text-foreground"
                                                    >
                                                        Verify official pricing
                                                        <span aria-hidden="true">↗</span>
                                                    </a>
                                                )}
                                            </div>
                                            <div className="min-w-40 text-right">
                                                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                    Current
                                                </div>
                                                <div className="mt-1 font-mono text-sm text-muted-foreground">
                                                    {fmt(finding.currentSpend)}/mo
                                                </div>
                                                <div className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                    Savings
                                                </div>
                                                <div className="mt-1 font-mono text-xl font-semibold text-foreground">
                                                    {finding.monthlySavings > 0 ? (
                                                        <span className="text-primary">-{fmt(finding.monthlySavings)}/mo</span>
                                                    ) : (
                                                        <span>No change</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {result.highValue && (
                        <section className="surface-card animate-fade-up relative overflow-hidden p-6" style={{ animationDelay: "0.15s" }}>
                            <div className="absolute inset-0 opacity-15" style={{ background: "var(--gradient-savings)" }} />
                            <div className="relative">
                                <p className="text-xs uppercase tracking-[0.2em] text-primary">
                                    Credex fit detected
                                </p>
                                <h2 className="mt-3 text-2xl font-semibold text-foreground">
                                    Retail pricing is the expensive part of your stack.
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                    The audit found more than {fmt(500)}/month in savings, which is exactly where
                                    discounted AI credits become a strong follow-up. This is the segment Credex should prioritize.
                                </p>
                                <a
                                    href="https://credex.com/?ref=audit"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-5 inline-flex items-center rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:opacity-90"
                                >
                                    Book a Credex consultation
                                </a>
                            </div>
                        </section>
                    )}

                    {!hideLeadCapture && (
                        <EmailGate
                            auditSlug={auditSlug}
                            input={input}
                            result={result}
                            summary={summary}
                            totalSaved={result.totalSaved}
                            highValue={result.highValue}
                            defaultTeamSize={input.teamSize}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
        <div className="rounded-2xl border border-border bg-background/80 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
            <div className={`mt-2 font-mono text-2xl font-semibold ${accent ? "text-primary" : "text-foreground"}`}>
                {value}
            </div>
        </div>
    );
}

function BenchmarkCard({ benchmark }: { benchmark: BenchmarkInsight }) {
    const ratio = Math.max(10, Math.min(100, (benchmark.currentPerSeat / Math.max(1, benchmark.benchmarkPerSeat * 1.6)) * 100));
    const optimizedRatio = Math.max(8, Math.min(100, (benchmark.optimizedPerSeat / Math.max(1, benchmark.benchmarkPerSeat * 1.6)) * 100));
    const tone = benchmark.status === "over"
        ? "text-primary"
        : benchmark.status === "lean"
            ? "text-accent-foreground"
            : "text-foreground";

    return (
        <section className="surface-card animate-fade-up p-5" style={{ animationDelay: "0.02s" }}>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Spend benchmark
                    </p>
                    <h2 className={`mt-2 text-lg font-semibold ${tone}`}>{benchmark.headline}</h2>
                </div>
                <div className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    Per developer / month
                </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">{benchmark.detail}</p>

            <div className="mt-5 space-y-3">
                <BarRow label="Current" value={`$${benchmark.currentPerSeat}`} width={ratio} fill="var(--gradient-warm)" />
                <BarRow label="Optimized" value={`$${benchmark.optimizedPerSeat}`} width={optimizedRatio} fill="var(--gradient-savings)" />
                <BarRow
                    label="Benchmark"
                    value={`$${benchmark.benchmarkPerSeat}`}
                    width={Math.max(8, Math.min(100, (benchmark.benchmarkPerSeat / Math.max(1, benchmark.benchmarkPerSeat * 1.6)) * 100))}
                    fill="linear-gradient(90deg, oklch(0.73 0.03 250), oklch(0.65 0.03 250))"
                />
            </div>
        </section>
    );
}

function WaterfallCard({ result }: { result: AuditResult }) {
    const reduction = result.totalCurrent > 0
        ? Math.round((result.totalSaved / result.totalCurrent) * 100)
        : 0;

    return (
        <section className="surface-card animate-fade-up p-5" style={{ animationDelay: "0.07s" }}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Savings profile
            </p>
            <div className="mt-3 flex items-end gap-3">
                <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Reduction achieved by recommended changes</div>
                    <div className="mt-1 text-3xl font-semibold text-foreground">{reduction}%</div>
                </div>
                <div className="rounded-2xl border border-primary/20 bg-primary/8 px-3 py-2 text-sm text-primary">
                    {result.findings.filter((f) => f.monthlySavings > 0).length} change{result.findings.filter((f) => f.monthlySavings > 0).length === 1 ? "" : "s"}
                </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-secondary">
                <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, reduction))}%`, background: "var(--gradient-savings)" }}
                />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="text-muted-foreground">Now</div>
                    <div className="mt-1 font-mono text-lg text-foreground">{fmt(result.totalCurrent)}</div>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="text-muted-foreground">After changes</div>
                    <div className="mt-1 font-mono text-lg text-primary">{fmt(result.optimizedSpend)}</div>
                </div>
            </div>
        </section>
    );
}

function BarRow({
    label,
    value,
    width,
    fill,
}: {
    label: string;
    value: string;
    width: number;
    fill: string;
}) {
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>{label}</span>
                <span>{value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full" style={{ width: `${width}%`, background: fill }} />
            </div>
        </div>
    );
}
