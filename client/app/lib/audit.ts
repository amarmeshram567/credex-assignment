import { TOOLS_BY_ID, type ToolPlan, type UseCase } from "./pricing";

export interface SpendLine {
    toolId: string;
    planId: string;
    monthlySpend: number;
    seats: number;
}

export interface AuditInput {
    lines: SpendLine[];
    teamSize: number;
    useCase: UseCase;
    companyName?: string;
    email?: string;
}

export type Severity = "high" | "medium" | "low" | "ok";

export interface LineFinding {
    toolId: string;
    toolName: string;
    planName: string;
    seats: number;
    currentSpend: number;
    recommendedAction: string;
    reason: string;
    monthlySavings: number;
    severity: Severity;
    alternative?: { name: string; planName: string; pricePerSeat: number };
}

export interface AuditResult {
    findings: LineFinding[];
    totalCurrent: number;
    totalSaved: number;
    totalAnnualSaved: number;
    optimizedSpend: number;
    optimal: boolean;
    highValue: boolean;
}

export interface BenchmarkInsight {
    benchmarkPerSeat: number;
    currentPerSeat: number;
    optimizedPerSeat: number;
    deltaFromBenchmark: number;
    status: "lean" | "within-range" | "over";
    headline: string;
    detail: string;
}

export function auditLine(line: SpendLine, teamSize: number, useCase: UseCase): LineFinding {
    const tool = TOOLS_BY_ID[line.toolId];
    const plan = tool?.plans.find((entry: ToolPlan) => entry.id === line.planId);

    if (!tool || !plan) {
        return {
            toolId: line.toolId,
            toolName: line.toolId,
            planName: line.planId,
            seats: line.seats,
            currentSpend: line.monthlySpend,
            recommendedAction: "Keep current plan",
            reason: "Unknown tool or plan. No recommendation was generated.",
            monthlySavings: 0,
            severity: "ok",
        };
    }

    const seats = Math.max(1, line.seats);
    const current = Math.max(0, line.monthlySpend);
    const baseline = plan.pricePerSeat * seats;

    if (plan.isApi) {
        if (current >= 1000) {
            return {
                toolId: tool.id,
                toolName: tool.name,
                planName: plan.name,
                seats,
                currentSpend: current,
                recommendedAction: "Source API credits below retail",
                reason: `${tool.name} spend is already material at ${formatMoney(current)}/month. A 20% to 30% credit discount is usually easier to realize than a model migration once usage is this high.`,
                monthlySavings: Math.round(current * 0.25),
                severity: "high",
            };
        }

        if (current >= 400) {
            return {
                toolId: tool.id,
                toolName: tool.name,
                planName: plan.name,
                seats,
                currentSpend: current,
                recommendedAction: "Review direct API pricing and credit options",
                reason: `${tool.name} is usage-based, so the clearest savings lever is procurement rather than downgrading. At this spend level, even a modest credit discount is meaningful.`,
                monthlySavings: Math.round(current * 0.15),
                severity: "medium",
            };
        }

        return {
            toolId: tool.id,
            toolName: tool.name,
            planName: plan.name,
            seats,
            currentSpend: current,
            recommendedAction: "Keep current plan",
            reason: "Direct API spend is still relatively modest. The likely savings are too small to justify operational churn right now.",
            monthlySavings: 0,
            severity: "ok",
        };
    }

    if (plan.minSeats && seats < plan.minSeats) {
        const fallbackPlan = findDowngradePlan(tool.id, tool.plans);
        if (fallbackPlan) {
            const newCost = fallbackPlan.pricePerSeat * seats;
            return {
                toolId: tool.id,
                toolName: tool.name,
                planName: plan.name,
                seats,
                currentSpend: current,
                recommendedAction: `Move to ${fallbackPlan.name}`,
                reason: `${tool.name} ${plan.name} is designed for at least ${plan.minSeats} seats. At ${seats} seats, you are paying for collaboration and admin overhead before the team size actually justifies it.`,
                monthlySavings: Math.max(0, current - newCost),
                severity: "high",
            };
        }
    }

    if (tool.id === "chatgpt" && plan.id === "team" && seats === 2) {
        const plus = tool.plans.find((entry) => entry.id === "plus")!;
        return {
            toolId: tool.id,
            toolName: tool.name,
            planName: plan.name,
            seats,
            currentSpend: current,
            recommendedAction: "Compare against two ChatGPT Plus seats",
            reason: "At two users, Team only breaks even with Plus on sticker price. If you do not need shared workspace controls yet, individual seats are the cleaner choice.",
            monthlySavings: Math.max(0, current - plus.pricePerSeat * seats),
            severity: "medium",
        };
    }

    if (tool.id === "cursor" && plan.id === "business" && seats <= 2) {
        const pro = tool.plans.find((entry) => entry.id === "pro")!;
        return {
            toolId: tool.id,
            toolName: tool.name,
            planName: plan.name,
            seats,
            currentSpend: current,
            recommendedAction: "Downgrade to Cursor Pro",
            reason: "Cursor Business mainly adds centralized administration and privacy controls. On one or two seats, most early-stage teams can defer those features and keep the same core coding workflow.",
            monthlySavings: Math.max(0, current - pro.pricePerSeat * seats),
            severity: "medium",
        };
    }

    if (tool.id === "claude" && plan.id === "max" && useCase !== "coding") {
        const pro = tool.plans.find((entry) => entry.id === "pro")!;
        return {
            toolId: tool.id,
            toolName: tool.name,
            planName: plan.name,
            seats,
            currentSpend: current,
            recommendedAction: "Downgrade to Claude Pro",
            reason: "Claude Max is priced for heavy, frequent use. For writing, research, or mixed workflows, Pro is usually enough unless this seat is constantly running long sessions.",
            monthlySavings: Math.max(0, current - pro.pricePerSeat * seats),
            severity: "high",
        };
    }

    if (tool.id === "gemini" && plan.id === "ultra" && useCase !== "data") {
        const pro = tool.plans.find((entry) => entry.id === "pro")!;
        return {
            toolId: tool.id,
            toolName: tool.name,
            planName: plan.name,
            seats,
            currentSpend: current,
            recommendedAction: "Downgrade to Google AI Pro",
            reason: "Gemini Ultra is expensive and mostly justified for users who consistently need the highest limits or premium creative features. For non-data-heavy work, AI Pro is usually the better fit.",
            monthlySavings: Math.max(0, current - pro.pricePerSeat * seats),
            severity: "high",
        };
    }

    if (tool.id === "cursor" && (useCase === "writing" || useCase === "research")) {
        return {
            toolId: tool.id,
            toolName: tool.name,
            planName: plan.name,
            seats,
            currentSpend: current,
            recommendedAction: "Replace with a lower-cost chat subscription",
            reason: `Cursor is a coding-first product. For ${useCase} work, you can usually get equivalent value from a general chat tool without paying for IDE-native features your team does not use.`,
            monthlySavings: Math.max(0, current - 20 * seats),
            severity: "medium",
        };
    }

    if (plan.id === "enterprise" && (plan.isCustomPriced || current > baseline) && teamSize < 25) {
        const downgrade = findDowngradePlan(tool.id, tool.plans);
        if (downgrade) {
            const newCost = downgrade.pricePerSeat * seats;
            return {
                toolId: tool.id,
                toolName: tool.name,
                planName: plan.name,
                seats,
                currentSpend: current,
                recommendedAction: `Downgrade to ${downgrade.name}`,
                reason: "Enterprise packaging tends to make sense once procurement, identity, audit, or centralized governance are mandatory. On a smaller team, those controls often arrive before the usage footprint does.",
                monthlySavings: Math.max(0, current - newCost),
                severity: "high",
            };
        }
    }

    if (baseline > 0 && current > baseline * 1.35) {
        const extra = current - baseline;
        return {
            toolId: tool.id,
            toolName: tool.name,
            planName: plan.name,
            seats,
            currentSpend: current,
            recommendedAction: `Investigate ${formatMoney(extra)}/month above list price`,
            reason: `${tool.name} ${plan.name} should be about ${formatMoney(baseline)}/month at list price for ${seats} seat${seats === 1 ? "" : "s"}. Paying materially above that usually means overages, unused seats, or custom packaging that needs to be revisited.`,
            monthlySavings: Math.round(extra * 0.6),
            severity: "high",
        };
    }

    return {
        toolId: tool.id,
        toolName: tool.name,
        planName: plan.name,
        seats,
        currentSpend: current,
        recommendedAction: "Keep current plan",
        reason: `${tool.name} ${plan.name} looks broadly right-sized for a ${useCase} team of ${teamSize}. The audit did not find a cheaper plan that preserves the same workflow assumptions.`,
        monthlySavings: 0,
        severity: "ok",
    };
}

export function runAudit(input: AuditInput): AuditResult {
    const findings = input.lines
        .filter((line) => line.monthlySpend > 0 || line.seats > 0)
        .map((line) => auditLine(line, input.teamSize, input.useCase));

    const duplicateCodingTools = input.lines.filter((line) =>
        ["cursor", "copilot", "windsurf"].includes(line.toolId),
    );

    if (duplicateCodingTools.length >= 2 && input.useCase === "coding") {
        const leastEfficient = findings
            .filter((finding) => ["cursor", "copilot", "windsurf"].includes(finding.toolId))
            .sort((a, b) => b.currentSpend - a.currentSpend)[0];

        if (leastEfficient && leastEfficient.monthlySavings === 0) {
            leastEfficient.recommendedAction = `Review overlap with your other coding assistant seats`;
            leastEfficient.reason = `Your team is paying for multiple coding copilots at once. Even if both are useful, overlap is the first place a finance review will push for consolidation.`;
            leastEfficient.monthlySavings = Math.round(leastEfficient.currentSpend * 0.3);
            leastEfficient.severity = "medium";
        }
    }

    const totalCurrent = findings.reduce((sum, finding) => sum + finding.currentSpend, 0);
    const totalSaved = findings.reduce((sum, finding) => sum + finding.monthlySavings, 0);

    return {
        findings: [...findings].sort((a, b) => b.monthlySavings - a.monthlySavings),
        totalCurrent,
        totalSaved,
        totalAnnualSaved: totalSaved * 12,
        optimizedSpend: Math.max(0, totalCurrent - totalSaved),
        optimal: totalSaved < 100,
        highValue: totalSaved > 500,
    };
}

export function getBenchmarkInsight(input: AuditInput, result: AuditResult): BenchmarkInsight {
    const benchmarkByUseCase: Record<UseCase, number> = {
        coding: 92,
        writing: 42,
        data: 68,
        research: 56,
        mixed: 78,
    };
    const benchmarkPerSeat = benchmarkByUseCase[input.useCase];
    const seatBase = Math.max(1, input.teamSize);
    const currentPerSeat = Math.round(result.totalCurrent / seatBase);
    const optimizedPerSeat = Math.round(result.optimizedSpend / seatBase);
    const deltaFromBenchmark = currentPerSeat - benchmarkPerSeat;

    if (deltaFromBenchmark > 20) {
        return {
            benchmarkPerSeat,
            currentPerSeat,
            optimizedPerSeat,
            deltaFromBenchmark,
            status: "over",
            headline: "You are above the typical AI spend band for your workflow.",
            detail: `Teams using AI mainly for ${input.useCase} work often land near $${benchmarkPerSeat}/developer/month. You are at $${currentPerSeat}, which points to duplicated tooling, plan mismatch, or expensive direct usage.`,
        };
    }

    if (deltaFromBenchmark < -15) {
        return {
            benchmarkPerSeat,
            currentPerSeat,
            optimizedPerSeat,
            deltaFromBenchmark,
            status: "lean",
            headline: "Your stack is already lean for this kind of team.",
            detail: `At $${currentPerSeat}/developer/month, you are below the typical $${benchmarkPerSeat} benchmark for ${input.useCase} teams. The bigger risk may be under-provisioning or fragmented adoption rather than overspend.`,
        };
    }

    return {
        benchmarkPerSeat,
        currentPerSeat,
        optimizedPerSeat,
        deltaFromBenchmark,
        status: "within-range",
        headline: "Your spend is in the normal range, but there is still room to tune it.",
        detail: `Comparable ${input.useCase} teams average about $${benchmarkPerSeat}/developer/month. You are at $${currentPerSeat}, so the audit is mostly finding efficiency improvements rather than a broken budget.`,
    };
}

function findDowngradePlan(toolId: string, plans: ToolPlan[]) {
    if (toolId === "claude") return plans.find((entry) => entry.id === "pro");
    if (toolId === "chatgpt") return plans.find((entry) => entry.id === "plus");
    return plans.find((entry) => entry.id === "business")
        || plans.find((entry) => entry.id === "team")
        || plans.find((entry) => entry.id === "pro")
        || plans.find((entry) => entry.id === "individual");
}

function formatMoney(value: number) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}
