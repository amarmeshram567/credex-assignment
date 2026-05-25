import type { AuditInput } from "./audit";

// Compact, URL-safe encoding of audit inputs so /a?d=... is fully shareable
// without a backend. PII (companyName, email) is stripped before encoding.
export function encodeShareState(input: AuditInput): string {
    const payload = {
        l: input.lines.map((l) => [l.toolId, l.planId, l.monthlySpend, l.seats]),
        t: input.teamSize,
        u: input.useCase,
    };
    const json = JSON.stringify(payload);
    const b64 = typeof window === "undefined"
        ? Buffer.from(json, "utf-8").toString("base64")
        : btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeShareState(d: string): AuditInput | null {
    try {
        const b64 = d.replace(/-/g, "+").replace(/_/g, "/");
        const json = typeof window === "undefined"
            ? Buffer.from(b64, "base64").toString("utf-8")
            : decodeURIComponent(escape(atob(b64)));
        const p = JSON.parse(json);
        return {
            lines: (p.l as [string, string, number, number][]).map(([toolId, planId, monthlySpend, seats]) => ({
                toolId, planId, monthlySpend, seats,
            })),
            teamSize: p.t,
            useCase: p.u,
        };
    } catch {
        return null;
    }
}
