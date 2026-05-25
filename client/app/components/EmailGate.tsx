"use client";

import { useState } from "react";

const STORAGE_KEY = "credex-leads-v1";

interface Lead {
    email: string;
    company?: string;
    role?: string;
    teamSize?: number;
    capturedAt: string;
    totalSaved: number;
}

export function EmailGate({
    auditSlug,
    totalSaved,
    highValue,
    defaultTeamSize,
}: {
    auditSlug?: string;
    totalSaved: number;
    highValue: boolean;
    defaultTeamSize?: number;
}) {
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [teamSize, setTeamSize] = useState(defaultTeamSize?.toString() ?? "");
    const [website, setWebsite] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (website) return;
        if (!auditSlug) {
            setError("The public report is still being prepared. Try again in a moment.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid work email.");
            return;
        }

        try {
            setSubmitting(true);
            const lead: Lead = {
                email: email.trim(),
                company: company.trim() || undefined,
                role: role.trim() || undefined,
                teamSize: teamSize ? Math.max(1, Number(teamSize)) : undefined,
                capturedAt: new Date().toISOString(),
                totalSaved,
            };

            const response = await fetch("/api/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    auditSlug,
                    ...lead,
                    website,
                }),
            });

            if (!response.ok) {
                throw new Error("Could not save your report.");
            }

            try {
                const existing: Lead[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
                existing.push(lead);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
            } catch {
                // Local persistence is optional; backend capture is the source of truth.
            }

            setSubmitted(true);
            setError(null);
        } catch {
            setError("Could not save your report right now.");
            return;
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="surface-card animate-fade-up p-6">
                <div className="flex items-start gap-4">
                    <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-primary/15">
                        <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Report captured</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            We saved your audit details. If email delivery is configured, a confirmation
                            message will be sent automatically, and high-savings cases are ready for
                            Credex follow-up.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="surface-card animate-fade-up p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Save your audit
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-foreground">
                        {highValue ? "Get the full report and a Credex follow-up" : "Stay on top of future savings"}
                    </h3>
                </div>
                <div className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    {highValue ? "High-value account" : "Light optimization case"}
                </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {highValue
                    ? "For meaningful savings cases, this flow should capture your email, confirm the audit, and hand off the best opportunities to Credex."
                    : "If your stack is already fairly efficient, the right move is lightweight lead capture so you can be notified when pricing or packaging changes."}
            </p>

            <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="sr-only"
                aria-hidden="true"
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Work email
                    </span>
                    <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </label>
                <label>
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Company
                    </span>
                    <input
                        type="text"
                        placeholder="Optional"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </label>
                <label>
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Role
                    </span>
                    <input
                        type="text"
                        placeholder="Founder, Eng Manager, CTO"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </label>
                <label>
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Team size
                    </span>
                    <input
                        type="number"
                        min={1}
                        placeholder="Optional"
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </label>
                <div className="flex items-end">
                    <div className="rounded-xl border border-primary/25 bg-primary/8 px-4 py-3 text-sm text-foreground">
                        Estimated savings identified: <span className="font-semibold">${totalSaved.toLocaleString()}/mo</span>
                    </div>
                </div>
            </div>

            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

            <button
                type="submit"
                disabled={submitting || !auditSlug}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-105"
            >
                {submitting
                    ? "Saving report..."
                    : highValue
                        ? "Capture report and consultation lead"
                        : "Capture report preferences"}
            </button>

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Honeypot protection is enabled to block low-effort bot submissions without adding friction before the user sees value.
            </p>
        </form>
    );
}
