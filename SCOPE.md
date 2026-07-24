# AdminVerified — Scope

Finalized 2026-07-21, six days before the founder's YC application (due
2026-07-27). This doc is the authoritative scope reference — update it in
place as the module grows, don't recreate it.

## Why this repo exists

The founder wants a single accountable structure for Government Compliance
& Admin — DENR, DOE, Real Property Tax, Business Permit, Fire Safety, ECC —
as its own product, matching the "every module gets its own repo" pattern
already used for StaffVerified (HR & Payroll), PNLVerified (P&L), and
OpsVerified (Fuel/Gas Ops). Today this content lives inside
`katiwala-owner-os-` ("Station Control") as the **Admin & Govt Compliance**
department (see that repo's `docs/KATIWALA_PRODUCT_FAMILY.md`, which
currently still describes it as staying inside Station Control — that
statement is now superseded by this repo's existence and should get a
dated update note).

## What v1 actually is (and isn't)

Confirmed scope decision with the founder, given the real timeline (this
competes for time with higher-priority Jul 27 items — Lens AI, StaffVerified
signal wiring, PNLVerified deploy+seed, the demo recording):

**v1 ships:**
- Full Next.js + Supabase auth: login, signup, forgot-password → email →
  reset-password, all working (same pattern as PNLVerified's auth, which
  itself was just hardened this session — visible input text, a real
  password-reset flow).
- A fresh compliance schema (`av_compliance_item_types`,
  `av_compliance_items`, `av_compliance_item_history`), seeded with
  realistic data.
- Dipstify branding (logo, "Dipstify" eyebrow + "AdminVerified" wordmark).

**v1 explicitly does NOT ship:**
- ~~A compliance list/create/status-update UI. The home page just shows a
  seeded-item count as proof the schema landed — nothing to actually
  manage yet.~~ **Shipped 2026-07-24** — same trajectory PNLVerified took
  (scaffold + schema first, UI came later): `/` lists every item sorted
  overdue → due_soon → preparing → on_track, with an inline status dropdown
  per row (writes both the item row and an `av_compliance_item_history`
  entry); `/new` creates an item against the seeded item-type list. Not yet
  tested end-to-end against a live login in this session — see the build
  session's own closing note for why (sandbox network policy blocks direct
  `*.supabase.co` calls from the dev server; `tsc --noEmit` and `next
  build` both pass clean, and the queries were checked column-by-column
  against `0001_compliance_schema.sql` instead).
- **Engineering.** Station Control's migration 046 is labeled "Engineering"
  in its header comment, but the live app code
  (`DEPARTMENT_EXTRA_FIELDS['Ops']`, `renderStationVolumeGrid`,
  `loadOpsStationDetail` in `katiwala-owner-os-/index.html`) treats that
  schema as **Ops's** real daily volume/price report, not Engineering's.
  Engineering's actual current fields are just two numbers
  (`open_repair_count`, `repairs_completed_count`). Building Engineering
  into AdminVerified this week risked copying the wrong schema under
  deadline pressure — deferred to v2, after that boundary gets written
  down explicitly in `katiwala-owner-os-`'s own docs.
- Any cross-repo bridge (an `/api/lens-summary`-style endpoint so Owner's
  Lens shows a live compliance signal). StaffVerified has exactly one such
  bridge; PNLVerified has none yet either. Build this only once this
  module's own schema/UI is real and stable, and once the family decides
  (per `katiwala-owner-os-`'s `docs/OWNERS_LENS_MODULE_INTEGRATION.md`,
  still an open question) which sync mechanism is the standing answer.
- Migrating Station Control's actual live `compliance_items` /
  `department_recurring_items` data into this repo. Those two tables are
  themselves a known, documented mess (two disconnected models covering
  overlapping ground) — this repo's schema is a fresh design informed by
  that history, not a live extraction of it.

## Data model

One unified table instead of Station Control's existing split between
`compliance_items` (legacy, project-scoped) and `department_recurring_items`
(department-scoped, newer):

- `av_compliance_item_types` — lookup table (code/label/category/cadence),
  so adding a new permit type is a data change, not a migration.
- `av_compliance_items` — the actual tracked items. `station_code` is
  nullable free text (some items like Business Permit are per-station,
  some like a DENR clearance are company-wide) — not a foreign key to a
  `stations` table, since none exists here yet and v1 has no UI that needs
  one.
- `av_compliance_item_history` — audit trail of status changes, something
  neither of Station Control's existing models has. Cheap to add now,
  useful evidence later.

Status vocabulary (`on_track`/`preparing`/`due_soon`/`overdue`)
deliberately matches `department_recurring_items`' newer vocabulary (not
`compliance_items`' older `ok`/`due_soon`/`urgent`) so a future bridge
summary can reuse the same labels without translating.

## Supabase project

**Shares `katiwala-owner-os-`'s existing Supabase project** rather than
provisioning a new one. The founder was already running 8 Supabase
projects across ventures (katiwala-owner-os, ODO, PnlVerified, RideVerified,
rv-valpro, Smart STN Pro, staffverified, theriderslamp) and wanted to avoid
a possible billing question mid-crunch. Tables are `av_`-prefixed
specifically to avoid colliding with that project's own tables. This is a
deliberate one-off exception to the family's usual "own Supabase project
per module" pattern (StaffVerified and PNLVerified each have their own) —
worth revisiting post-launch once there's time to check whether a
dedicated project makes more sense.

## Open items for the build phase

- Compliance list/create/status-update UI (the actual v1 feature).
- Engineering module (v2, once the Ops boundary is documented).
- Decide the cross-repo signal mechanism into Owner's Lens.
- Revisit whether this should move to its own Supabase project.
