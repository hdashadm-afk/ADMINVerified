-- AdminVerified — Engineering reports (v2).
--
-- Runs against the same shared katiwala-owner-os- (KOS) Supabase project
-- as 0001_compliance_schema.sql — see that file's header and SCOPE.md's
-- "Supabase project" section. The actual copy that gets run lives in
-- katiwala-owner-os-'s supabase/migrations/112_engineering_reports_adminverified.sql
-- (same content, numbered into that project's sequence).
--
-- This is the REAL Engineering data model — NOT katiwala-owner-os-'s
-- migration 046, despite that migration's header comment saying
-- "Engineering". Migration 046's actual content (cluster1_shift_status,
-- weather_condition, per-station volume_actual/volume_budget,
-- own_price/competitor_price) is Ops's daily volume/price report,
-- confirmed directly against the live app code: loadOpsStationDetail()
-- queries report_station_volumes/report_station_prices (both created by
-- migration 046) and is explicitly the Ops report-detail renderer.
--
-- The live app's actual Engineering fields
-- (DEPARTMENT_EXTRA_FIELDS['Engineering'] in katiwala-owner-os-'s
-- app.html) are just two numbers: open_repair_count,
-- repairs_completed_count. This table matches that real shape. The
-- migration-046 vs. Engineering boundary this SCOPE.md previously
-- deferred on is now written down explicitly — see the dated correction
-- in katiwala-owner-os-'s docs/KATIWALA_GAS_STATION_MASTER_DIRECTION.md
-- and the correction comment added to migration 046 itself.

create table av_engineering_reports (
  id uuid primary key default gen_random_uuid(),
  station_code text,
  report_date date not null default current_date,
  open_repair_count integer,
  repairs_completed_count integer,
  notes text,
  reported_by text,
  created_at timestamptz default now()
);

alter table av_engineering_reports enable row level security;

create policy "authenticated can read av_engineering_reports" on av_engineering_reports for select to authenticated using (true);
create policy "authenticated can manage av_engineering_reports" on av_engineering_reports for all to authenticated using (true);
