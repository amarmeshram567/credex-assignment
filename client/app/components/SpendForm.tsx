"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SpendLine } from "@/lib/audit";
import { encodeShareState } from "@/lib/share";
import { TOOLS, USE_CASES, type Tool, type ToolPlan, type UseCase } from "@/lib/pricing";

const STORAGE_KEY = "credex-audit-draft-v1";

interface Draft {
    lines: SpendLine[];
    teamSize: number;
    useCase: UseCase;
}

const empty: Draft = { lines: [], teamSize: 5, useCase: "coding" };

export function SpendForm() {
    const router = useRouter();
    const [draft, setDraft] = useState<Draft>(empty);
    const hasMounted = useRef(false);

    useEffect(() => {
        hasMounted.current = true;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) {
                setDraft((current) => ({ ...current, ...JSON.parse(raw) }));
            }
        } catch {
            // Ignore malformed local drafts and keep the default state.
        }
    }, []);

    useEffect(() => {
        if (hasMounted.current) localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }, [draft]);

    const toggleTool = (toolId: string) => {
        setDraft((current) => {
            const exists = current.lines.find((line) => line.toolId === toolId);
            if (exists) {
                return { ...current, lines: current.lines.filter((line) => line.toolId !== toolId) };
            }

            const tool = TOOLS.find((entry) => entry.id === toolId)!;
            const defaultPlan = tool.plans.find((plan) => plan.pricePerSeat > 0) ?? tool.plans[0];
            return {
                ...current,
                lines: [
                    ...current.lines,
                    {
                        toolId,
                        planId: defaultPlan.id,
                        seats: 1,
                        monthlySpend: defaultPlan.pricePerSeat,
                    },
                ],
            };
        });
    };

    const updateLine = (toolId: string, patch: Partial<SpendLine>) => {
        setDraft((current) => ({
            ...current,
            lines: current.lines.map((line) => (line.toolId === toolId ? { ...line, ...patch } : line)),
        }));
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (draft.lines.length === 0) return;
        router.push(`/a?d=${encodeShareState(draft)}`);
    };

    const total = draft.lines.reduce((sum, line) => sum + (line.monthlySpend || 0), 0);
    const perSeat = Math.round(total / Math.max(1, draft.teamSize));

    return (
        <form onSubmit={submit} className="space-y-7">
            <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            1. Select the AI tools your company pays for
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            We support seat-based plans and direct API spend in the same audit.
                        </p>
                    </div>
                    <div className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                        {draft.lines.length} selected
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {TOOLS.map((tool) => {
                        const active = draft.lines.some((line) => line.toolId === tool.id);
                        return (
                            <button
                                key={tool.id}
                                type="button"
                                onClick={() => toggleTool(tool.id)}
                                className={`panel-hover rounded-2xl border px-4 py-4 text-left transition ${
                                    active
                                        ? "border-primary/35 bg-primary/8"
                                        : "border-border bg-background hover:border-primary/25"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">{tool.name}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">{tool.vendor}</div>
                                    </div>
                                    <span
                                        className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wide ${
                                            active ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                                        }`}
                                    >
                                        {active ? "Selected" : tool.category}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {draft.lines.length > 0 && (
                <section className="animate-fade-up">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                2. Add plan, seat count, and current monthly spend
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Use what you actually pay, not just list price. Overages are useful signal.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {draft.lines.map((line) => {
                            const tool = TOOLS.find((entry) => entry.id === line.toolId)!;
                            const selectedPlan = tool.plans.find((plan) => plan.id === line.planId) ?? tool.plans[0];
                            return (
                                <ToolLineCard
                                    key={line.toolId}
                                    line={line}
                                    tool={tool}
                                    selectedPlan={selectedPlan}
                                    onChange={updateLine}
                                />
                            );
                        })}
                    </div>
                </section>
            )}

            <section className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
                <div className="rounded-3xl border border-border bg-background p-4">
                    <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            3. Team size
                        </span>
                        <input
                            type="number"
                            min={1}
                            value={draft.teamSize}
                            onChange={(e) =>
                                setDraft((current) => ({
                                    ...current,
                                    teamSize: Math.max(1, Number(e.target.value) || 1),
                                }))
                            }
                            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </label>
                    <div className="mt-4 rounded-2xl border border-border bg-card p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            Current spend per developer
                        </div>
                        <div className="mt-2 text-3xl font-semibold text-foreground">${perSeat}</div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            This benchmark anchor is one of the fastest ways to spot overspend before the tool-by-tool audit even runs.
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-border bg-background p-4">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        4. Primary use case
                    </span>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {USE_CASES.map((useCase) => {
                            const active = draft.useCase === useCase.id;
                            return (
                                <button
                                    key={useCase.id}
                                    type="button"
                                    onClick={() => setDraft((current) => ({ ...current, useCase: useCase.id }))}
                                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                                        active
                                            ? "border-primary/35 bg-primary/8 text-foreground"
                                            : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground"
                                    }`}
                                >
                                    {useCase.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className="rounded-3xl border border-border bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            Current monthly AI spend
                        </div>
                        <div className="mt-2 font-mono text-3xl font-semibold text-foreground">
                            ${total.toLocaleString()}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={draft.lines.length === 0}
                        className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Run free audit
                    </button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                    Form state is saved locally, so you can refresh or come back later without losing your draft.
                </p>
            </div>
        </form>
    );
}

function ToolLineCard({
    line,
    tool,
    selectedPlan,
    onChange,
}: {
    line: SpendLine;
    tool: Tool;
    selectedPlan: ToolPlan;
    onChange: (toolId: string, patch: Partial<SpendLine>) => void;
}) {
    const listPrice = selectedPlan.pricePerSeat > 0 ? selectedPlan.pricePerSeat * line.seats : 0;

    return (
        <div className="panel-hover rounded-3xl border border-border bg-background p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                <div>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h4 className="text-base font-semibold text-foreground">{tool.name}</h4>
                            <p className="mt-1 text-sm text-muted-foreground">{tool.vendor}</p>
                        </div>
                        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                            {tool.category}
                        </span>
                    </div>
                    <div className="mt-4 rounded-2xl border border-border bg-card p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            Official list price
                        </div>
                        <div className="mt-2 font-mono text-xl font-semibold text-foreground">
                            {listPrice > 0 ? `$${listPrice}/mo` : "Usage based"}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Entering a higher actual bill helps the audit detect overages, unused seats, or enterprise markup.
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <label className="sm:col-span-3">
                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Plan
                        </span>
                        <select
                            value={line.planId}
                            onChange={(e) => onChange(line.toolId, { planId: e.target.value })}
                            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            aria-label={`${tool.name} plan`}
                        >
                            {tool.plans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name}
                                    {plan.pricePerSeat > 0 ? ` - $${plan.pricePerSeat}/seat` : ""}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Seats
                        </span>
                        <input
                            type="number"
                            min={1}
                            value={line.seats}
                            onChange={(e) =>
                                onChange(line.toolId, { seats: Math.max(1, Number(e.target.value) || 1) })
                            }
                            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </label>
                    <label className="sm:col-span-2">
                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Actual monthly spend
                        </span>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                $
                            </span>
                            <input
                                type="number"
                                min={0}
                                value={line.monthlySpend}
                                onChange={(e) =>
                                    onChange(line.toolId, {
                                        monthlySpend: Math.max(0, Number(e.target.value) || 0),
                                    })
                                }
                                className="w-full rounded-2xl border border-border bg-card py-3 pl-8 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}
