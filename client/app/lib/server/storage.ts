import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AuditInput, AuditResult } from "@/lib/audit";

export interface LeadCapture {
    email: string;
    company?: string;
    role?: string;
    teamSize?: number;
    totalSaved: number;
    capturedAt: string;
}

export interface StoredAudit {
    id: string;
    shareSlug: string;
    createdAt: string;
    auditInput: AuditInput;
    auditResult: AuditResult;
    summary: string;
    lead?: LeadCapture;
}

const LOCAL_PATH = path.join(process.cwd(), ".local-data", "audits.json");
const TABLE = process.env.SUPABASE_AUDITS_TABLE || "audits";

export async function createStoredAudit(
    auditInput: AuditInput,
    auditResult: AuditResult,
    summary: string,
): Promise<StoredAudit> {
    const record: StoredAudit = {
        id: crypto.randomUUID(),
        shareSlug: createSlug(),
        createdAt: new Date().toISOString(),
        auditInput,
        auditResult,
        summary,
    };

    if (hasSupabaseConfig()) {
        await insertSupabaseRecord(record);
        return record;
    }

    await upsertLocalRecord(record);
    return record;
}

export async function getStoredAuditBySlug(slug: string): Promise<StoredAudit | null> {
    if (hasSupabaseConfig()) {
        return getSupabaseRecord(slug);
    }

    const rows = await readLocalRecords();
    return rows.find((row) => row.shareSlug === slug) ?? null;
}

export async function attachLeadToAudit(slug: string, lead: LeadCapture): Promise<StoredAudit | null> {
    if (hasSupabaseConfig()) {
        return attachSupabaseLead(slug, lead);
    }

    const rows = await readLocalRecords();
    const index = rows.findIndex((row) => row.shareSlug === slug);
    if (index === -1) return null;
    rows[index] = { ...rows[index], lead };
    await writeLocalRecords(rows);
    return rows[index];
}

function hasSupabaseConfig() {
    return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function createSlug() {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

async function insertSupabaseRecord(record: StoredAudit) {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${TABLE}`, {
        method: "POST",
        headers: supabaseHeaders({
            Prefer: "return=representation",
        }),
        body: JSON.stringify(toSupabaseRow(record)),
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Supabase insert failed with status ${response.status}`);
    }
}

async function getSupabaseRecord(slug: string): Promise<StoredAudit | null> {
    const response = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/${TABLE}?share_slug=eq.${encodeURIComponent(slug)}&select=*`,
        {
            headers: supabaseHeaders(),
            cache: "no-store",
        },
    );

    if (!response.ok) {
        throw new Error(`Supabase select failed with status ${response.status}`);
    }

    const rows = (await response.json()) as SupabaseAuditRow[];
    return rows[0] ? fromSupabaseRow(rows[0]) : null;
}

async function attachSupabaseLead(slug: string, lead: LeadCapture): Promise<StoredAudit | null> {
    const existing = await getSupabaseRecord(slug);
    if (!existing) return null;

    const response = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/${TABLE}?share_slug=eq.${encodeURIComponent(slug)}`,
        {
            method: "PATCH",
            headers: supabaseHeaders({
                Prefer: "return=representation",
            }),
            body: JSON.stringify({
                lead_email: lead.email,
                lead_payload: lead,
            }),
            cache: "no-store",
        },
    );

    if (!response.ok) {
        throw new Error(`Supabase update failed with status ${response.status}`);
    }

    const rows = (await response.json()) as SupabaseAuditRow[];
    return rows[0] ? fromSupabaseRow(rows[0]) : null;
}

function supabaseHeaders(extra?: Record<string, string>) {
    return {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
        ...extra,
    };
}

async function upsertLocalRecord(record: StoredAudit) {
    const rows = await readLocalRecords();
    rows.push(record);
    await writeLocalRecords(rows);
}

async function readLocalRecords(): Promise<StoredAudit[]> {
    try {
        const raw = await readFile(LOCAL_PATH, "utf8");
        return JSON.parse(raw) as StoredAudit[];
    } catch {
        return [];
    }
}

async function writeLocalRecords(rows: StoredAudit[]) {
    await mkdir(path.dirname(LOCAL_PATH), { recursive: true });
    await writeFile(LOCAL_PATH, JSON.stringify(rows, null, 2));
}

interface SupabaseAuditRow {
    id: string;
    share_slug: string;
    created_at: string;
    audit_input: AuditInput;
    audit_result: AuditResult;
    summary: string;
    lead_payload?: LeadCapture | null;
}

function toSupabaseRow(record: StoredAudit): SupabaseAuditRow {
    return {
        id: record.id,
        share_slug: record.shareSlug,
        created_at: record.createdAt,
        audit_input: record.auditInput,
        audit_result: record.auditResult,
        summary: record.summary,
        lead_payload: record.lead ?? null,
    };
}

function fromSupabaseRow(row: SupabaseAuditRow): StoredAudit {
    return {
        id: row.id,
        shareSlug: row.share_slug,
        createdAt: row.created_at,
        auditInput: row.audit_input,
        auditResult: row.audit_result,
        summary: row.summary,
        lead: row.lead_payload ?? undefined,
    };
}
