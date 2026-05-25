create extension if not exists pgcrypto;

create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  share_slug text not null unique,
  created_at timestamptz not null default now(),
  audit_input jsonb not null,
  audit_result jsonb not null,
  summary text not null,
  lead_email text,
  lead_payload jsonb
);

create index if not exists audits_created_at_idx on public.audits (created_at desc);
create index if not exists audits_share_slug_idx on public.audits (share_slug);
