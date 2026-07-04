# ProductPulse — Claude Code Project Memory

## What this is

ProductPulse is a Fischer Product Lab portfolio product: an executive product-analytics dashboard tracking adoption, engagement/usage, revenue, and business outcomes for a fictional B2B SaaS product — including a dedicated registry that traces AI and standard initiatives to the metric movement they actually caused. **Read** `docs/PRODUCTPULSE_BUILD_KIT.md` **before building anything** — it has the full spec, data model, and synthetic dataset. Don't build ahead of it from memory.

If `docs/product_pulse_context.md` exists locally (it's gitignored — agent handoff, not public), read it too: it records build history, decisions, and known gotchas, and should be kept up to date as work continues.

## Fischer Product Lab suite (sibling products — for framing/consistency only; do not modify these repos)

- AgentOps — AI agent governance control tower — [https://agentops-fpl.vercel.app/](https://agentops-fpl.vercel.app/)
- TrustDesk — customer trust automation — [https://trustdesk-fpl.vercel.app/](https://trustdesk-fpl.vercel.app/)
- VulnBoard — executive vulnerability metrics — [https://vuln-board.vercel.app/](https://vuln-board.vercel.app/)
- GitHub org: github.com/Fischer-Product-Lab (this repo goes here too)

Suite thesis: turn noisy, high-stakes reality into governed, decision-quality executive signal. The first three apply that to AI agent risk, customer trust, and vulnerability exposure. **ProductPulse applies it to product performance** — and it's the natural second half of AgentOps: AgentOps decides if an initiative is safe to launch; ProductPulse shows whether it worked.

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Lint before every commit: `npm run lint`
- Build before every commit: `npm run build`



## Stack

Next.js App Router, TypeScript strict mode, Tailwind CSS, shadcn/ui, Recharts, deployed on Vercel from GitHub `main`. No backend, no database — typed synthetic data in `src/data/`.

## Brand system (match the sibling repos exactly — this is a suite, not a one-off)

- Background `#0b0f17` (near-black navy) · text `#f5efe1` (ivory) · accent `#c9a45c` → `#f0d18a` (gold gradient)
- Headings: Fraunces. Body: Hanken Grotesk.
- Premium executive SaaS feel: dense but readable, strong information hierarchy, no gimmicky AI visuals, no fear-based or hype copy.



## Hard rules (non-negotiable — same as every Fischer Product Lab product)

- Read-only. No forms, no write paths, no auth, no uploads.
- Synthetic data only, clearly labeled "synthetic demo data" in the UI.
- No secrets, no API keys, no `NEXT_PUBLIC_` env vars unless explicitly asked.
- No live model calls in V1. The initiative impact status (Strong Impact / Monitor / Underperforming) is **deterministic**, computed from stored numbers — never AI-generated. Explainability over impressiveness, same as AgentOps.
- Don't touch the AgentOps, TrustDesk, or VulnBoard repos from this project.



## Scope boundary

V1 shipped six routes — executive brief, adoption, engagement, revenue, initiatives (the differentiator), about — and V1.1 added `/retention` (cohort curves + churn-risk segmentation, explicitly requested July 2026) plus a glossary on the About page. Resist adding further screens unless explicitly asked; extend the existing pattern (typed data in `src/data/`, deterministic engines in `src/lib/`, tests) instead.

## Workflow

Run `npm run lint` and `npm run build` before proposing any commit. Build one screen at a time from the build kit's prompt sequence; stop and show me the result before moving to the next. If something in the build kit is ambiguous, ask rather than guessing.