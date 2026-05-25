"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuditResults } from "@/components/AuditResults";
import type { AuditInput, AuditResult } from "@/lib/audit";
import { runAudit } from "@/lib/audit";
import { decodeShareState } from "@/lib/share";
import { buildFallbackSummary } from "@/lib/summary";

export default function AuditPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading audit...</div>}>
            <AuditPageContent />
        </Suspense>
    );
}

function AuditPageContent() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [input, setInput] = useState<AuditInput | null>(null);
    const [result, setResult] = useState<AuditResult | null>(null);
    const [summary, setSummary] = useState("");
    const [shareUrl, setShareUrl] = useState("");
    const [auditSlug, setAuditSlug] = useState<string | undefined>();

    useEffect(() => {
        const run = async () => {
            try {
                const encoded = searchParams.get("d");
                if (!encoded) {
                    setError("No audit data provided.");
                    setLoading(false);
                    return;
                }

                const decoded = decodeShareState(encoded);
                if (!decoded) {
                    setError("Invalid audit data.");
                    setLoading(false);
                    return;
                }

                const auditResult = runAudit(decoded);
                const fallbackShareUrl = `${window.location.origin}/a?d=${encoded}`;
                setInput(decoded);
                setResult(auditResult);
                setShareUrl(fallbackShareUrl);

                try {
                    const aiSummary = await requestSummary(auditResult, decoded);
                    setSummary(aiSummary);
                    const auditResponse = await fetch("/api/audits", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            input: decoded,
                            result: auditResult,
                            summary: aiSummary,
                        }),
                    });

                    if (auditResponse.ok) {
                        const payload = (await auditResponse.json()) as {
                            shareSlug: string;
                            publicUrl: string;
                        };
                        const publicUrl = `${window.location.origin}${payload.publicUrl}`;
                        setAuditSlug(payload.shareSlug);
                        setShareUrl(publicUrl);
                    } else {
                        throw new Error("Could not persist audit");
                    }
                } catch {
                    setSummary(buildFallbackSummary(auditResult, decoded.useCase, decoded.teamSize));
                }
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to run audit.");
                setLoading(false);
            }
        };

        run();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/60">
                <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
                    <div className="text-center">
                        <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Running your audit</p>
                        <h1 className="mt-3 text-2xl font-semibold text-foreground">
                            Comparing your stack against plan-fit and pricing rules.
                        </h1>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/60">
                <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
                    <div className="surface-card max-w-xl p-8 text-center">
                        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-2xl text-destructive">
                            !
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">We could not build this audit.</h1>
                        <p className="mt-3 text-muted-foreground">{error}</p>
                        <Link
                            href="/"
                            className="mt-6 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:opacity-90"
                        >
                            Return to the audit form
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!result || !input) return null;

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/60">
            <AuditResults
                input={input}
                result={result}
                summary={summary}
                shareUrl={shareUrl}
                auditSlug={auditSlug}
            />
        </div>
    );
}

async function requestSummary(result: AuditResult, input: AuditInput) {
    const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ result, input }),
    });

    if (!response.ok) {
        throw new Error("Summary API failed");
    }

    const payload = (await response.json()) as { summary?: string };
    if (!payload.summary) {
        throw new Error("Summary missing");
    }

    return payload.summary;
}
