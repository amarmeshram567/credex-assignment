import type { AuditResult } from "./audit";

const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function buildSummaryPrompt(result: AuditResult, useCase: string, teamSize: number) {
    const topFindings = result.findings
        .filter((finding) => finding.monthlySavings > 0)
        .slice(0, 3)
        .map((finding) => ({
            tool: finding.toolName,
            action: finding.recommendedAction,
            savings: finding.monthlySavings,
            reason: finding.reason,
        }));

    return {
        system: "You are a concise B2B fintech-style analyst writing a plain-English AI spend audit summary for a startup founder or engineering manager. Be specific, not hypey. Keep it under 110 words. Do not use bullet points. Mention savings only if they are real.",
        user: JSON.stringify(
            {
                useCase,
                teamSize,
                totalCurrent: result.totalCurrent,
                totalSaved: result.totalSaved,
                totalAnnualSaved: result.totalAnnualSaved,
                highValue: result.highValue,
                optimal: result.optimal,
                topFindings,
            },
            null,
            2,
        ),
    };
}

export function buildFallbackSummary(
    result: AuditResult,
    useCase: string,
    teamSize: number,
): string {
    const { totalCurrent, totalSaved, totalAnnualSaved, findings, highValue, optimal } = result;
    const topFinding = [...findings].sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

    if (optimal) {
        return `Your team of ${teamSize} is spending ${fmt(totalCurrent)}/month on AI tools, and based on your ${useCase} workflow the stack looks appropriately sized. We did not find a meaningful downgrade or consolidation move today. The right next step is to keep monitoring seat utilization and revisit the audit when pricing, team size, or usage patterns change.`;
    }

    const pct = Math.round((totalSaved / Math.max(1, totalCurrent)) * 100);
    const lead = highValue
        ? `Your stack has meaningful slack: roughly ${fmt(totalSaved)}/month (${pct}%) is recoverable without disrupting day-to-day work.`
        : `There is a modest ${fmt(totalSaved)}/month (${pct}%) of optimization available in your current stack.`;

    const detail = topFinding && topFinding.monthlySavings > 0
        ? ` The biggest lever is ${topFinding.toolName} ${topFinding.planName}; ${topFinding.recommendedAction.toLowerCase()} saves about ${fmt(topFinding.monthlySavings)}/month.`
        : "";

    const closer = highValue
        ? ` Over a year that compounds to ${fmt(totalAnnualSaved)}, which is large enough to justify a procurement-level fix rather than another month of retail spend.`
        : ` Annualized, that is ${fmt(totalAnnualSaved)}. Worth fixing, but this is optimization rather than an emergency.`;

    return `Your ${useCase} team of ${teamSize} is spending ${fmt(totalCurrent)}/month across these tools. ${lead}${detail}${closer}`;
}
