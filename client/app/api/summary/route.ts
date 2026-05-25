import { NextResponse } from "next/server";
import type { AuditInput, AuditResult } from "@/lib/audit";
import { buildFallbackSummary, buildSummaryPrompt } from "@/lib/summary";

export async function POST(request: Request) {
    try {
        const { input, result } = (await request.json()) as {
            input: AuditInput;
            result: AuditResult;
        };

        if (!input || !result) {
            return NextResponse.json({ error: "Missing audit payload." }, { status: 400 });
        }

        const fallback = buildFallbackSummary(result, input.useCase, input.teamSize);

        if (!process.env.ANTHROPIC_API_KEY) {
            return NextResponse.json({ summary: fallback, source: "fallback" });
        }

        const prompt = buildSummaryPrompt(result, input.useCase, input.teamSize);
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: process.env.ANTHROPIC_SUMMARY_MODEL || "claude-sonnet-4-0",
                max_tokens: 180,
                temperature: 0.4,
                system: prompt.system,
                messages: [
                    {
                        role: "user",
                        content: prompt.user,
                    },
                ],
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ summary: fallback, source: "fallback" });
        }

        const payload = (await response.json()) as {
            content?: Array<{ type: string; text?: string }>;
        };

        const summary = payload.content?.find((item) => item.type === "text")?.text?.trim() || fallback;
        return NextResponse.json({ summary, source: summary === fallback ? "fallback" : "anthropic" });
    } catch {
        return NextResponse.json({ error: "Failed to generate summary." }, { status: 500 });
    }
}
