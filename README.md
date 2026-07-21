# AdminVerified

**Government Compliance & Admin** — part of the Dipstify product family.

## Status

Early scaffold (2026-07-21). Next.js + Supabase auth (login/signup/password
reset) is fully working. The compliance schema (`av_compliance_item_types`,
`av_compliance_items`, `av_compliance_item_history`) is created and seeded
with realistic data. **No live compliance list/create UI yet** — that's an
explicit, deliberate v1 scope cut, see [`SCOPE.md`](./SCOPE.md).

This repo exists so the module has its own home per the Dipstify
architecture rule ("every page has their own repo"), matching the pattern
already used by [`staffverified-app`](https://github.com/hdashadm-afk/staffverified-app)
(StaffVerified), [`pnlverified`](https://github.com/hdashadm-afk/pnlverified)
(PNLVerified), and [`fuel-ops`](https://github.com/hdashadm-afk/fuel-ops)
(OpsVerified/StationVerified).

## Context

- AdminVerified covers what [`katiwala-owner-os-`](https://github.com/hdashadm-afk/katiwala-owner-os-)
  ("Station Control") calls the **Admin & Govt Compliance** department —
  DENR, DOE, Real Property Tax, Business Permit Renewal, Fire Safety
  Inspection Certificate, ECC, plus contracts/rentals.
- **Engineering is deliberately NOT part of this repo yet.** Station
  Control's own migration 046 (labeled "Engineering") is actually live as
  **Ops's** daily volume/price report, not Engineering's — see that
  repo's `index.html` `DEPARTMENT_EXTRA_FIELDS` for the real boundary.
  Engineering's true schema (2 fields: open/completed repair counts) is
  small and will be added here later, once that boundary is written down
  properly — not rushed into v1.
- Station Control's own Admin & Govt Compliance UI (and Arlene's
  `internal_admin` access to it) keeps running unchanged — this repo does
  not replace it yet, it's a fresh build growing alongside it.

## Brand family

Part of the shared Dipstify ecosystem — same logo, color system,
typography, spacing, and component style. See `katiwala-owner-os-`'s
`docs/DIPSTIFY_BRAND_GUIDE.md` for the shared design system (black/white/
steel-gray + safety-yellow accent, Inter Tight/Inter/JetBrains Mono).

## Stack

Next.js (App Router) + TypeScript + Tailwind + Supabase.

**Deliberately shares `katiwala-owner-os-`'s existing Supabase project**
rather than provisioning a new one — the founder was already running 8
Supabase projects across ventures and wanted to sidestep any billing
question mid-crunch. AdminVerified's tables are `av_`-prefixed to avoid any
collision with that project's own tables. This is a one-off exception to
the family's usual "own Supabase project per module" pattern (see
`SCOPE.md`).

## Getting started

```bash
npm install
cp .env.local.example .env.local   # already has real values — same KOS project
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Schema lives in `supabase/migrations/0001_compliance_schema.sql` — kept
here for this repo's own history. **The copy that actually gets run lives
in `katiwala-owner-os-`'s `supabase/migrations/099_adminverified_compliance_schema.sql`**,
since that's the real project these tables live in. `supabase/seed.sql` is
reference/demo data, already applied.
