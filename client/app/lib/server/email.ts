import type { LeadCapture, StoredAudit } from "@/lib/server/storage";

export async function sendAuditConfirmationEmail(audit: StoredAudit, lead: LeadCapture) {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
        return { delivered: false, reason: "missing_resend_config" as const };
    }

    const subject = audit.auditResult.highValue
        ? `Your Stacklane audit found ${formatMoney(audit.auditResult.totalSaved)}/month in savings`
        : "Your Stacklane AI spend audit is ready";

    const body = `
Hi,

Thanks for using Stacklane.

We saved your audit for ${lead.company || "your team"} and found ${formatMoney(audit.auditResult.totalSaved)} in potential monthly savings.

Public report:
${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/report/${audit.shareSlug}

${audit.auditResult.highValue
        ? "Because your savings opportunity is material, Credex may follow up with options for discounted AI credits."
        : "Your current stack looks relatively efficient. We will only reach out if pricing or packaging changes create a new optimization opportunity."}

Thanks,
Stacklane by Credex
`.trim();

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL,
            to: [lead.email],
            subject,
            text: body,
        }),
    });

    if (!response.ok) {
        throw new Error(`Resend email failed with status ${response.status}`);
    }

    return { delivered: true as const };
}

function formatMoney(value: number) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}
