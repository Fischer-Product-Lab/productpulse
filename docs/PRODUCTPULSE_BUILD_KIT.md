# ProductPulse — Build Kit

**What this file is:** the full spec for ProductPulse, plus the exact prompts to give Claude Code, one at a time. `CLAUDE.md` points here — Claude Code should read this before writing any code.

**How to use it:** work through Section 6 in order. After each prompt, run `npm run dev`, look at the result in the browser, then `npm run lint && npm run build` before committing. Don't accept a screen you haven't looked at.

---

## 1. What ProductPulse is (one paragraph)

ProductPulse is an **executive product-analytics dashboard**. It tracks how a fictional B2B SaaS product is actually doing — adoption, engagement, usage, revenue — and, critically, it maintains an **Initiative Registry** that connects specific shipped work (AI features and standard product work alike) to the metric movement that followed. Most growth dashboards answer "what happened." ProductPulse also answers "what did we ship that caused it, and did it work?"

## 2. How it relates to AgentOps (say this in interviews)

AgentOps asks *"is this AI initiative safe to launch?"* before it ships. ProductPulse asks *"did it actually work?"* after it ships. Same suite, same rigor, applied to the two halves of a product's life — governance before, accountability after.

## 3. V1 guardrails (non-negotiable)

- Read-only. Nothing submits, edits, or deletes.
- Synthetic data only, labeled as such in the UI.
- No AI calls. The initiative status is **deterministic** — same inputs, same status, always. This is a feature: explainable beats impressive.
- No secrets in the browser.

## 4. Scope: 6 screens for V1 (do not add more)

| Route | Screen | Job |
|---|---|---|
| `/` | **Executive Brief** | North Star metric, headline KPIs, needs-attention list. |
| `/adoption` | **Adoption & Activation** | Signup→Activated→Habitual funnel; feature/initiative adoption rates. |
| `/engagement` | **Engagement & Usage** | DAU/WAU/MAU trend, stickiness ratio, user-segment breakdown. |
| `/revenue` | **Revenue & Business Impact** | MRR trend, expansion/contraction, NRR, AI cost-savings rollup. |
| `/initiatives` | **Initiative Registry** (the differentiator) | Every shipped initiative, before→after metric movement, computed status. |
| `/about` | **About this demo** | Product context, architecture, security posture, links to docs and sibling products. |

V1.1 (do not build yet): `/retention` — cohort retention curves and churn-risk segmentation. Note it in the About page as "coming next," nothing more.

## 5. Data model

Put all data in `src/data/productpulse.ts`, fully typed.

```ts
export type InitiativeType = "AI" | "Standard";
export type ImpactStatus = "Strong Impact" | "Monitor" | "Underperforming";
export type UserSegment = "Power" | "Core" | "Casual" | "At Risk" | "Dormant";

export interface Initiative {
  id: string;
  name: string;
  type: InitiativeType;
  owner: string;
  launchDate: string;          // ISO date
  description: string;         // one sentence: what shipped
  adoptionPctBefore: number;   // baseline adoption of the relevant workflow, 0-100
  adoptionPctAfter: number;    // current adoption, 0-100
  engagementLiftPct: number;   // % change in the relevant engagement metric, can be negative
  hoursSavedPerMonth?: number;      // primarily for AI initiatives
  costSavedPerMonthUsd?: number;    // derived or direct
  revenueImpactUsd?: number;        // expansion/retention $ attributable, can be 0
  narrative: string;           // 1 sentence: why it moved (or didn't move) the needle
}

export interface EngagementSnapshot { date: string; dau: number; wau: number; mau: number; }
export interface RevenueSnapshot {
  date: string; mrr: number; newMrr: number;
  expansionMrr: number; contractionMrr: number; churnedMrr: number;
}
export interface AdoptionFunnelStage { stage: "Signed Up" | "Activated" | "Habitual"; count: number; }
export interface UserSegmentBreakdown { segment: UserSegment; userCount: number; pctOfBase: number; }
```

## 6. The impact-status function (the centerpiece — build as a pure function, same spirit as AgentOps' readiness engine)

Put it in `src/lib/impact.ts`.

```ts
export interface ImpactResult {
  status: ImpactStatus;
  adoptionLiftPts: number;   // adoptionPctAfter - adoptionPctBefore
  reasons: string[];
}

export function computeImpact(i: Initiative): ImpactResult {
  const lift = i.adoptionPctAfter - i.adoptionPctBefore;
  const hasMeaningfulOutcome = (i.hoursSavedPerMonth ?? 0) > 5 || (i.revenueImpactUsd ?? 0) > 1000;

  if (lift >= 25 && hasMeaningfulOutcome) {
    return { status: "Strong Impact", adoptionLiftPts: lift, reasons: ["Adoption lift ≥25 pts with a measurable business outcome"] };
  }
  if (lift < 5) {
    return { status: "Underperforming", adoptionLiftPts: lift, reasons: ["Adoption lift under 5 pts since launch — investigate or sunset"] };
  }
  return { status: "Monitor", adoptionLiftPts: lift, reasons: ["Positive but modest movement — keep watching next cycle"] };
}
```

Same rule as AgentOps: the UI always displays what this function returns. Never hardcode a status.

## 7. Synthetic initiatives (use these 8 — pre-designed for a believable spread)

| id | Name | Type | Adoption Before→After | Hours Saved/mo | Revenue Impact | → Status |
|---|---|---|---|---|---|---|
| ini-001 | AI Jira Triage Assistant | AI | 12→64 | 40 | $0 | **Strong Impact** |
| ini-002 | Self-Serve Onboarding Redesign | Standard | 18→55 | — | $42,000 | **Strong Impact** |
| ini-003 | AI Release Notes Drafting | AI | 8→51 | 22 | $0 | **Strong Impact** |
| ini-004 | AI Support Ticket Summarizer | AI | 15→38 | 14 | $0 | **Monitor** |
| ini-005 | Usage-Based Pricing Migration | Standard | 30→46 | — | $58,000 | **Monitor** |
| ini-006 | Mobile Push Re-engagement | Standard | 22→27 | — | $3,200 | **Underperforming** |
| ini-007 | In-App Gamification Badges | Standard | 5→9 | — | $0 | **Underperforming** |
| ini-008 | AI Executive Brief Generator | AI | 10→41 | 18 | $0 | **Strong Impact** |

Tell Claude Code: keep the adoption numbers and hours/revenue figures exactly as listed so `computeImpact` reproduces the status shown; invent realistic values for owner, launchDate, description, and narrative for each.

## 8. Prompts for Claude Code — one at a time

Claude Code already has `CLAUDE.md` and this file in context. Reference them by name rather than re-explaining.

**Prompt A — Theme + shell**
> Read CLAUDE.md and docs/PRODUCTPULSE_BUILD_KIT.md. Set up the design system per the brand section in CLAUDE.md (Tailwind CSS variables, Fraunces headings via next/font, Hanken Grotesk body). Build the shared app shell: left sidebar nav (Brief, Adoption, Engagement, Revenue, Initiatives, About), a top bar with a "Synthetic demo data" badge, responsive layout. No data yet.

**Prompt B — Data + the impact function**
> Create `src/data/productpulse.ts` with the types from Section 5 and the 8 initiatives from Section 7 — keep the adoption/hours/revenue numbers exact, invent the rest realistically. Add representative EngagementSnapshot, RevenueSnapshot, AdoptionFunnelStage, and UserSegmentBreakdown arrays for a plausible 6-month history. Then implement `src/lib/impact.ts` exactly per Section 6, and add a test asserting each of the 8 initiatives resolves to the status shown in the table.

**Prompt C — Initiative Registry (`/initiatives`)**
> Build `/initiatives`: a card or table view of all initiatives showing name, type badge (AI/Standard), owner, a small before→after sparkline or bar for adoption, the computed status badge (color-coded), and the narrative line. Clicking shows the full reasons from `computeImpact`. This is the differentiator screen — make it the most polished one.

**Prompt D — Adoption (`/adoption`)**
> Build `/adoption`: the Signed Up → Activated → Habitual funnel as a Recharts funnel or stacked bar, plus a table of adoption rate by initiative filterable by type (AI/Standard).

**Prompt E — Engagement (`/engagement`)**
> Build `/engagement`: DAU/WAU/MAU trend line, a stickiness ratio (DAU/MAU) callout, and a user-segment breakdown chart (Power/Core/Casual/At Risk/Dormant).

**Prompt F — Revenue (`/revenue`)**
> Build `/revenue`: MRR trend line, an expansion/contraction/churn waterfall or stacked bar, an NRR calculation displayed prominently, and an "AI cost-savings" rollup card summing hoursSavedPerMonth × a stated blended hourly rate across AI initiatives.

**Prompt G — Executive Brief (`/`)**
> Build `/` as the executive overview: pick one North Star metric (e.g., Weekly Active Teams) and chart it, plus KPI tiles for activation rate, stickiness ratio, NRR, and total AI hours saved this month. Add a "Needs attention" list pulling any initiative with status Monitor or Underperforming.

**Prompt H — About + docs + security**
> Build `/about` following the pattern in the sibling repos: product context, architecture summary, security posture, and links back to AgentOps, TrustDesk, and VulnBoard. Create `README.md`, `SECURITY.md`, and `docs/threat-model.md` (STRIDE table, read-only demo). Enable TypeScript strict mode if not already on.

**Prompt I — Deploy**
> Walk me through deploying to Vercel from GitHub. Name the Vercel project `productpulse-fpl` from the start so the live URL is `productpulse-fpl.vercel.app` — skip the rename dance. Confirm no environment variables are needed for V1.

## 9. Definition of done

In three minutes you can open the live URL and show: the executive brief → the initiative registry → point at the AI Jira Triage Assistant (Strong Impact) and explain why → point at the gamification badges (Underperforming) and explain that too → adoption funnel → engagement stickiness → revenue NRR → the about page's security posture. If you can narrate all of that, V1 is done.
