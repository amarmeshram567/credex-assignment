import test from "node:test";
import assert from "node:assert/strict";
import { auditLine, runAudit, type AuditInput } from "../app/lib/audit";

test("Claude Team under minimum seats recommends downgrade", () => {
    const finding = auditLine(
        {
            toolId: "claude",
            planId: "team",
            seats: 3,
            monthlySpend: 75,
        },
        3,
        "mixed",
    );

    assert.equal(finding.recommendedAction, "Move to Pro");
    assert.equal(finding.monthlySavings, 15);
    assert.equal(finding.severity, "high");
});

test("Cursor Business on two seats suggests Pro", () => {
    const finding = auditLine(
        {
            toolId: "cursor",
            planId: "business",
            seats: 2,
            monthlySpend: 80,
        },
        2,
        "coding",
    );

    assert.match(finding.recommendedAction, /Cursor Pro/);
    assert.equal(finding.monthlySavings, 40);
});

test("Large API spend recommends discounted credits", () => {
    const finding = auditLine(
        {
            toolId: "openai-api",
            planId: "usage",
            seats: 1,
            monthlySpend: 1600,
        },
        12,
        "coding",
    );

    assert.match(finding.recommendedAction, /credits/i);
    assert.equal(finding.monthlySavings, 400);
    assert.equal(finding.severity, "high");
});

test("Gemini Ultra downgrade is triggered for non-data workflows", () => {
    const finding = auditLine(
        {
            toolId: "gemini",
            planId: "ultra",
            seats: 1,
            monthlySpend: 99.99,
        },
        4,
        "writing",
    );

    assert.match(finding.recommendedAction, /Google AI Pro/);
    assert.ok(finding.monthlySavings >= 79);
});

test("Over-list-price seat spend flags overages", () => {
    const finding = auditLine(
        {
            toolId: "copilot",
            planId: "business",
            seats: 5,
            monthlySpend: 180,
        },
        8,
        "coding",
    );

    assert.match(finding.recommendedAction, /Investigate/);
    assert.equal(finding.severity, "high");
});

test("runAudit marks duplicate coding assistants as a consolidation opportunity", () => {
    const input: AuditInput = {
        teamSize: 6,
        useCase: "coding",
        lines: [
            { toolId: "cursor", planId: "pro", seats: 3, monthlySpend: 60 },
            { toolId: "copilot", planId: "business", seats: 3, monthlySpend: 57 },
        ],
    };

    const result = runAudit(input);

    assert.ok(result.totalSaved > 0);
    assert.ok(result.findings.some((finding) => /overlap|consolidation/i.test(finding.reason)));
});
