# Groundcrew — Signed to kickoff, on autopilot

SOW-to-project AI for agencies. Upload a signed proposal → the crew extracts
deliverables, milestones and budgets with page-level citations → a human
approves in a split-view editor → Groundcrew pushes the plan to ClickUp or
Asana, spins up a branded client portal, and chases every missing item.

Built from the three-plan set: `10` design (Flight Line Editorial) ·
`11` code (Next.js 16, G-steps) · `12` ship (CI, deploy, verify), on the
`05_Build_Spec_OnboardPilot` PRD.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 (CSS-first tokens)
· TypeScript · Fraunces / Inter / Geist Mono · lucide-react · deployed on Vercel.

## Demo walkthrough (no external APIs)

1. `/` — marketing site with the scripted sample-SOW extraction replay
2. `/dashboard` — Northbeam Digital demo tenant: PipelineBoard, TimeSavedTicker
3. `/upload` (or `?sample=1`) — intake → runway processing screen
4. `/onboardings/acme-seo/review` — **the money screen**: citation-grounded
   split view; `[` `]` cycle items, `Enter` jumps to the source quote
5. Approve & push → ClickUp/Asana diff modal → "Cleared for takeoff"
6. `/p/demo` — client portal: 6-digit magic-link gate (any digits in demo),
   pre-flight checklist with questionnaire / uploads / access grants
7. `/onboardings/acme-seo` — detail tabs incl. ChaseTimeline
8. `/templates`, `/settings`, `/tower` — libraries, integrations, agency console

## Develop

```bash
corepack enable
pnpm install
pnpm dev        # localhost:3000
pnpm build      # production build (typecheck included)
pnpm test       # node:test — fixture integrity + citation grounding
pnpm design-qa  # Plan 10 §10 gate: zero raw hex in components/
```

## Design system

Tokens in `app/tokens.css` (Plan 10 §3 verbatim): warm ink/paper neutrals,
tower navy for primary actions, **cleared green only for verified/approved/
complete**, marshal orange only for overdue/escalation, brass hairlines never
interactive. Fraunces display / Inter UI / Geist Mono data.

## Demo-build adaptations (wiring points for production)

- Document pane renders the SOW as paginated HTML; swap in pdf.js + real
  fixtures (G10) when  land — citation jump/pulse API is in place.
- Parse pipeline, auth, push, chase are deterministic simulations of PRD
  F1–F5; the NestJS API + BullMQ workers (G19) slot behind the same screens.
- Demo tenant seed per G22 lives in `lib/demo-data.ts` + `lib/review-fixture.ts`.
