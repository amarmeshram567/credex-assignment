import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditResults } from "@/components/AuditResults";
import { getStoredAuditBySlug } from "@/lib/server/storage";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const audit = await getStoredAuditBySlug(slug);

    if (!audit) {
        return {
            title: "Report not found | Stacklane",
        };
    }

    const title = audit.auditResult.optimal
        ? "This AI stack is already well optimized"
        : `${formatMoney(audit.auditResult.totalSaved)}/mo in AI savings found`;
    const description = audit.auditResult.optimal
        ? `Stacklane audited this team's AI stack and found no major waste.`
        : `Stacklane found ${formatMoney(audit.auditResult.totalAnnualSaved)}/year in potential AI spend savings across ${audit.auditResult.findings.length} tools.`;
    const publicUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/report/${slug}`;

    return {
        title: `${title} | Stacklane`,
        description,
        openGraph: {
            title: `${title} | Stacklane`,
            description,
            type: "article",
            url: publicUrl,
            images: [`${publicUrl}/opengraph-image`],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | Stacklane`,
            description,
            images: [`${publicUrl}/opengraph-image`],
        },
    };
}

export default async function PublicReportPage({ params }: Props) {
    const { slug } = await params;
    const audit = await getStoredAuditBySlug(slug);

    if (!audit) notFound();

    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/report/${slug}`;

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/60">
            <AuditResults
                input={audit.auditInput}
                result={audit.auditResult}
                summary={audit.summary}
                shareUrl={shareUrl}
                auditSlug={audit.shareSlug}
                hideLeadCapture
            />
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
