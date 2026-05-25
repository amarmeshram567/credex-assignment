import { NextResponse } from "next/server";
import type { AuditInput, AuditResult } from "@/lib/audit";
import { checkRateLimit, getRateLimitKey } from "@/lib/server/rate-limit";
import { createStoredAudit } from "@/lib/server/storage";

export async function POST(request: Request) {
    try {
        const rateLimit = checkRateLimit(getRateLimitKey(request, "audit"), 25, 60_000);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: "Too many audits created from this IP. Please try again shortly." },
                { status: 429 },
            );
        }

        const { input, result, summary } = (await request.json()) as {
            input: AuditInput;
            result: AuditResult;
            summary: string;
        };

        if (!input || !result || !summary) {
            return NextResponse.json({ error: "Missing audit payload." }, { status: 400 });
        }

        const stored = await createStoredAudit(input, result, summary);
        return NextResponse.json({
            auditId: stored.id,
            shareSlug: stored.shareSlug,
            publicUrl: `/report/${stored.shareSlug}`,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to persist audit." },
            { status: 500 },
        );
    }
}
