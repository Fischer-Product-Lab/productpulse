/**
 * Canonical metric definitions — the single source of truth for the
 * About-page glossary and the stat-card tooltips, so the same term is
 * never explained two different ways.
 */

export const METRIC_DEFS = {
  dau: "Daily Active Users — unique users who took a meaningful action on a given day.",
  wau: "Weekly Active Users — unique users active in the last 7 days.",
  mau: "Monthly Active Users — unique users active in the last 30 days.",
  stickiness:
    "DAU ÷ MAU — the share of monthly active users who show up on a given day; a measure of how habitual the product is.",
  activationRate:
    "The share of signed-up accounts that reached their first core workflow.",
  habitRate:
    "The share of activated accounts that made the product part of their regular routine.",
  adoptionLift:
    "Percentage-point change in adoption of the relevant workflow, from the pre-launch baseline to today.",
  mrr: "Monthly Recurring Revenue — subscription revenue normalized to one month.",
  netNewMrr:
    "The total change in Monthly Recurring Revenue this month: new + expansion − contraction − churned.",
  nrr: "Net Revenue Retention — recurring revenue kept from the existing customer base after expansion, contraction, and churn. Above 100% means the base grows even with zero new sales.",
  aiCostSavings:
    "Hours of manual work eliminated by AI initiatives, valued at a blended fully-loaded hourly rate ($95/hr in this demo).",
  impactStatus:
    "Deterministic rating of every shipped initiative: Strong Impact (adoption lift ≥25 pts plus a measurable business outcome), Underperforming (lift under 5 pts), Monitor (everything between). Computed by a pure function — never asserted.",
  cohortRetention:
    "Of the users who activated in a given month, the share still active N months later. Each row of the cohort table follows one activation class through time.",
  churnRisk:
    "Deterministic per-segment rating from usage signals: High (inactive 30+ days, or under 0.5 sessions/week while inactive 14+ days), Elevated (under 2 sessions/week, inactive 7+ days, or seat utilization under 30%), Low otherwise.",
  seatUtilization:
    "The share of purchased seats that are actively used across a segment's accounts.",
  attributionCaveat:
    "A flag raised when another initiative launched within six weeks of this one — adoption movement inside that shared window may belong to either launch, so neither can claim it cleanly.",
} as const;

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const glossary: GlossaryEntry[] = [
  { term: "DAU", definition: METRIC_DEFS.dau },
  { term: "WAU", definition: METRIC_DEFS.wau },
  { term: "MAU", definition: METRIC_DEFS.mau },
  { term: "Stickiness", definition: METRIC_DEFS.stickiness },
  { term: "Activation rate", definition: METRIC_DEFS.activationRate },
  { term: "Habit rate", definition: METRIC_DEFS.habitRate },
  { term: "Adoption lift", definition: METRIC_DEFS.adoptionLift },
  { term: "MRR", definition: METRIC_DEFS.mrr },
  { term: "Net new MRR", definition: METRIC_DEFS.netNewMrr },
  { term: "NRR", definition: METRIC_DEFS.nrr },
  { term: "AI cost savings", definition: METRIC_DEFS.aiCostSavings },
  { term: "Impact status", definition: METRIC_DEFS.impactStatus },
  { term: "Cohort retention", definition: METRIC_DEFS.cohortRetention },
  { term: "Churn risk", definition: METRIC_DEFS.churnRisk },
  { term: "Seat utilization", definition: METRIC_DEFS.seatUtilization },
  { term: "Attribution caveat", definition: METRIC_DEFS.attributionCaveat },
];
