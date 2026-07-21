-- AdminVerified — Compliance/Admin schema (v1: schema + seed only, no
-- live list/create UI yet — see SCOPE.md).
--
-- Runs against the EXISTING katiwala-owner-os- (KOS) Supabase project —
-- AdminVerified deliberately does NOT get its own new Supabase project
-- this week (founder: avoid a possible 4th/5th-project billing question
-- mid-crunch — see SCOPE.md). Tables are `av_`-prefixed to avoid any name
-- collision with KOS's own tables in the same project. This file is kept
-- here for AdminVerified's own migration history; the actual copy that
-- gets run lives in katiwala-owner-os-'s supabase/migrations/099_*.sql
-- (same content, numbered into that project's sequence).
--
-- Fresh design, informed by (not copied from) katiwala-owner-os-'s two
-- existing, disconnected compliance models (`compliance_items` — legacy,
-- project-scoped; `department_recurring_items` — department-scoped). One
-- unified table here instead of that split. Status vocabulary
-- (on_track/preparing/due_soon/overdue) matches department_recurring_items'
-- newer vocabulary on purpose, so a future read-only bridge summary (same
-- pattern as StaffVerified's /api/lens-summary) can reuse the same labels
-- without translation.

create table av_compliance_item_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  category text not null default 'government' check (category in ('government', 'contract', 'other')),
  default_cadence text
);

create table av_compliance_items (
  id uuid primary key default gen_random_uuid(),
  station_code text,
  item_type_id uuid not null references av_compliance_item_types(id),
  title text,
  cadence text,
  due_date date,
  status text not null default 'preparing' check (status in ('on_track', 'preparing', 'due_soon', 'overdue')),
  owner text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table av_compliance_item_history (
  id uuid primary key default gen_random_uuid(),
  compliance_item_id uuid not null references av_compliance_items(id) on delete cascade,
  status text not null,
  changed_at timestamptz default now(),
  changed_by uuid references auth.users(id)
);

alter table av_compliance_item_types enable row level security;
alter table av_compliance_items enable row level security;
alter table av_compliance_item_history enable row level security;

create policy "authenticated can read av_compliance_item_types" on av_compliance_item_types for select to authenticated using (true);
create policy "authenticated can manage av_compliance_item_types" on av_compliance_item_types for all to authenticated using (true);

create policy "authenticated can read av_compliance_items" on av_compliance_items for select to authenticated using (true);
create policy "authenticated can manage av_compliance_items" on av_compliance_items for all to authenticated using (true);

create policy "authenticated can read av_compliance_item_history" on av_compliance_item_history for select to authenticated using (true);
create policy "authenticated can manage av_compliance_item_history" on av_compliance_item_history for all to authenticated using (true);
