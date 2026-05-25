import { ImageResponse } from "next/og";
import { getStoredAuditBySlug } from "@/lib/server/storage";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const audit = await getStoredAuditBySlug(slug);

    const monthly = audit?.auditResult.totalSaved || 0;
    const annual = audit?.auditResult.totalAnnualSaved || 0;
    const headline = audit?.auditResult.optimal
        ? "This team is already spending well on AI."
        : `${formatMoney(monthly)}/mo in AI savings found`;

    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #f8f6ef 0%, #eef6ef 48%, #eef0f7 100%)",
                    padding: "56px",
                    color: "#163041",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: "#55727d" }}>
                        Stacklane
                    </div>
                    <div
                        style={{
                            fontSize: 20,
                            padding: "10px 18px",
                            borderRadius: 999,
                            background: "rgba(22, 48, 65, 0.08)",
                        }}
                    >
                        AI spend audit
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ fontSize: 68, lineHeight: 1.05, fontWeight: 700, maxWidth: 900 }}>
                        {headline}
                    </div>
                    <div style={{ fontSize: 28, lineHeight: 1.4, color: "#4e6672", maxWidth: 900 }}>
                        {audit?.auditResult.optimal
                            ? "No obvious downgrade or consolidation move surfaced in this audit."
                            : `Annualized savings: ${formatMoney(annual)} across ${audit?.auditResult.findings.length || 0} tools.`}
                    </div>
                </div>
                <div style={{ display: "flex", gap: 18 }}>
                    <StatCard label="Current spend" value={formatMoney(audit?.auditResult.totalCurrent || 0)} />
                    <StatCard label="Optimized spend" value={formatMoney(audit?.auditResult.optimizedSpend || 0)} />
                    <StatCard label="Use case" value={audit?.auditInput.useCase || "mixed"} />
                </div>
            </div>
        ),
        size,
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flex: 1,
                padding: "22px 24px",
                background: "rgba(255,255,255,0.74)",
                border: "1px solid rgba(22,48,65,0.08)",
                borderRadius: 28,
            }}
        >
            <div style={{ fontSize: 18, textTransform: "uppercase", letterSpacing: 2, color: "#6d838d" }}>
                {label}
            </div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>{value}</div>
        </div>
    );
}

function formatMoney(value: number) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}
