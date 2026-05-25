import { NextResponse } from "next/server";
import { checkRateLimit, getRateLimitKey } from "@/lib/server/rate-limit";
import { attachLeadToAudit, type LeadCapture } from "@/lib/server/storage";
import { sendAuditConfirmationEmail } from "@/lib/server/email";

export async function POST(request: Request) {
    try {
        const rateLimit = checkRateLimit(getRateLimitKey(request, "lead"), 8, 60_000);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: "Too many lead submissions from this IP. Please wait a minute and try again." },
                { status: 429 },
            );
        }

        const { auditSlug, email, company, role, teamSize, totalSaved, website } = (await request.json()) as {
            auditSlug: string;
            email: string;
            company?: string;
            role?: string;
            teamSize?: number;
            totalSaved: number;
            website?: string;
        };

        if (website) {
            return NextResponse.json({ ok: true, ignored: true });
        }

        if (!auditSlug || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: "Invalid lead payload." }, { status: 400 });
        }

        const lead: LeadCapture = {
            email: email.trim(),
            company: company?.trim() || undefined,
            role: role?.trim() || undefined,
            teamSize: teamSize ? Math.max(1, teamSize) : undefined,
            totalSaved,
            capturedAt: new Date().toISOString(),
        };

        const updated = await attachLeadToAudit(auditSlug, lead);
        if (!updated) {
            return NextResponse.json({ error: "Audit not found." }, { status: 404 });
        }

        let emailDelivery: "sent" | "skipped" | "failed" = "skipped";
        try {
            const delivery = await sendAuditConfirmationEmail(updated, lead);
            emailDelivery = delivery.delivered ? "sent" : "skipped";
        } catch {
            emailDelivery = "failed";
        }

        return NextResponse.json({ ok: true, emailDelivery });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to capture lead." },
            { status: 500 },
        );
    }
}
