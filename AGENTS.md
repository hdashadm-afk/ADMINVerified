<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Product family context

This repo (AdminVerified) is one of the modules under **Owner's Lens**, the
gas-station owner operating product family led by `katiwala-owner-os-`
(brand: **Dipstify**, `dipstify.com`). See that repo's
`docs/KATIWALA_PRODUCT_FAMILY.md` and `docs/DIPSTIFY_BRAND_GUIDE.md` for the
umbrella brand/structure.

AdminVerified covers Government Compliance & Admin — see `SCOPE.md` for the
full scope decision, including why Engineering is explicitly deferred to v2
and why this repo deliberately shares `katiwala-owner-os-`'s existing
Supabase project instead of provisioning a new one.

**Read `katiwala-owner-os-`'s `docs/FOUNDER_PROFILE.md` at the start of
every session (2026-07-31 addition).** Single reference for who the
founder is (solo, no dev team, mobile-heavy, terse phrasing) and
consolidates every standing preference below plus working-style lessons
from direct feedback not captured anywhere else.

# Session-start operating preference — "Founder's Lens"

Confirmed by the founder 2026-07-21 (same rule now in `katiwala-owner-os-`'s
`docs/MASTER_DIRECTION.md` §11, `staffverified-app`'s `AGENTS.md`, and
`pnlverified`'s `AGENTS.md` — applies across the whole product family, not
just one repo): deliver a baseline-grounded status automatically at the
start of a session — don't wait to be asked "what's on my plate." Named
**Founder's Lens** by the founder — same naming family as Lens (the KOS
assistant) and Owner's Lens (the product's top-level dashboard): "get to
see everything before deciding to start the day," applied to how Claude
opens a session. Check current repo state, don't assume from memory. Format
is always a table: item / priority / effort / purpose (why it matters),
with 🔴/🟡/🟢 for urgency (plain chat text can't render literal color) and
Low/Medium/High for effort (the founder's rough read on how much work the
item is, to help him triage what to greenlight now vs. schedule for later).
Coverage must be exhaustive, not curated — every open PR, every
unmerged/unactioned item, every decision still waiting on the founder,
across every repo the session has touched, not a top-3. Opening line:
**"Boss, here's your Lens today"** (or equivalent), then straight into the
full table — not a re-explanation of what Founder's Lens is each time.

# Instruction-delivery preference — Standard Instruction Form

Confirmed by the founder 2026-07-23, superseding the 2026-07-21 HTML-
artifact attempt below (kept only as historical record — **do not build
an HTML artifact or file for multi-step instructions**, it turned out to
add more friction than it removed: a link/page to open instead of
reacting immediately). Same rule now in `katiwala-owner-os-`'s
`docs/MASTER_DIRECTION.md` §11 and mirrored in `staffverified-app`/
`pnlverified`/`fuel-ops`'s own `AGENTS.md`. **2026-07-31: this repo's
AGENTS.md had never actually been updated with this correction — still
had the superseded artifact version 8 days later. Found and fixed while
cross-linking `FOUNDER_PROFILE.md`; check the other repos' AGENTS.md
periodically stay in sync too, drift like this is easy to miss silently.**

Multi-step instructions go in a **plain markdown table, posted directly
in the chat reply** — a one-line Objective, then three columns, Step /
Where / How:

**Objective:** *one line — what this accomplishes and why it matters*

| Step | Where | How |
|---|---|---|
| 1 | *the site/dashboard* | *what to do, exact literal values inline as `code`* |

Rules:
- Always lead with the one-line Objective before the table.
- No link, no file, no artifact — the objective + table is the entire reply.
- Number rows sequentially across the whole instruction set, even across
  different topics/sites — don't restart numbering per topic.
- Exact literal values (env var names, secrets, URLs, webhook event
  names) go inline as `` `code` `` — never prose the founder has to
  retype.
- Where is the complete, exact address whenever known, not a vague
  breadcrumb — use the real URL verbatim if a screenshot or prior
  navigation already revealed it. Fall back to a breadcrumb only when no
  exact URL is known yet.
- Chat text outside the table stays to one or two sentences.
- No persisted checkbox state (accepted tradeoff) — for a task spanning
  multiple sessions, re-confirm progress rather than relying on memory.
- Apply whenever a task has 3+ sequential steps, even within a single
  site (not just across multiple sites) — no exception for "it's only
  2-3 steps really."
- SQL/code snippets: always their own clean, standalone code block,
  nothing else mixed in, one-tap copyable.
