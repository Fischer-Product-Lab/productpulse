/**
 * ProductPulse synthetic dataset — all figures are fictional demo data.
 * Types and initiative figures follow docs/PRODUCTPULSE_BUILD_KIT.md
 * (Sections 5 and 7). Adoption, hours-saved, and revenue numbers are
 * kept exactly as specified so `computeImpact` reproduces the intended
 * status spread — except ini-006's adoptionPctAfter (27 in the kit),
 * lowered to 26 so its lift clears the `lift < 5` Underperforming rule
 * the table intends for it (22→27 is exactly 5 and would rate Monitor).
 */

export type InitiativeType = "AI" | "Standard";
export type ImpactStatus = "Strong Impact" | "Monitor" | "Underperforming";
export type UserSegment = "Power" | "Core" | "Casual" | "At Risk" | "Dormant";

export interface AdoptionSample {
  weeksSinceLaunch: number;  // negative = before launch
  adoptionPct: number;
}

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
  /**
   * Biweekly adoption samples from ~8 weeks pre-launch to today. The
   * first sample equals adoptionPctBefore and the last equals
   * adoptionPctAfter (test-enforced), so the evidence chart and the
   * headline numbers can never disagree.
   */
  adoptionSeries: AdoptionSample[];
  /** AI initiatives: the AgentOps pre-launch governance review reference. */
  agentOpsReviewId?: string;
}

export interface EngagementSnapshot {
  date: string;
  dau: number;
  wau: number;
  mau: number;
}

export interface RevenueSnapshot {
  date: string;
  mrr: number;
  newMrr: number;
  expansionMrr: number;
  contractionMrr: number;
  churnedMrr: number;
}

export interface AdoptionFunnelStage {
  stage: "Signed Up" | "Activated" | "Habitual";
  count: number;
}

export interface UserSegmentBreakdown {
  segment: UserSegment;
  userCount: number;
  pctOfBase: number;
}

export interface CohortRetention {
  cohort: string;          // "2026-01" — the month the users activated
  activatedUsers: number;
  retentionPct: number[];  // index = months since activation; [0] is always 100
}

export interface SegmentRiskSignal {
  segment: UserSegment;
  avgSessionsPerWeek: number;
  medianDaysSinceLastActive: number;
  seatUtilizationPct: number;  // used seats ÷ purchased seats in this segment's accounts
  mrrUsd: number;              // MRR attributed to accounts dominated by this segment
}

/** Blended fully-loaded hourly rate used to convert hours saved into cost saved. */
export const BLENDED_HOURLY_RATE_USD = 95;

/** Compact tuple form for adoption series: [weeksSinceLaunch, adoptionPct]. */
const series = (pts: [number, number][]): AdoptionSample[] =>
  pts.map(([weeksSinceLaunch, adoptionPct]) => ({ weeksSinceLaunch, adoptionPct }));

export const initiatives: Initiative[] = [
  {
    id: "ini-001",
    name: "AI Jira Triage Assistant",
    type: "AI",
    owner: "Priya Raghavan",
    launchDate: "2026-01-12",
    description:
      "Auto-triages inbound Jira tickets with a suggested priority, component, and assignee.",
    adoptionPctBefore: 12,
    adoptionPctAfter: 64,
    engagementLiftPct: 21,
    hoursSavedPerMonth: 40,
    costSavedPerMonthUsd: 40 * BLENDED_HOURLY_RATE_USD,
    revenueImpactUsd: 0,
    narrative:
      "Triage time per ticket dropped from minutes to seconds, so team leads kept it on after the pilot.",
    adoptionSeries: series([
      [-8, 12], [-6, 11], [-4, 12], [-2, 12],
      [0, 12], [2, 18], [4, 26], [6, 35], [8, 43], [10, 50], [12, 55],
      [14, 58], [16, 61], [18, 62], [20, 63], [22, 64], [24, 64],
    ]),
    agentOpsReviewId: "AGT-0134",
  },
  {
    id: "ini-002",
    name: "Self-Serve Onboarding Redesign",
    type: "Standard",
    owner: "Marcus Bell",
    launchDate: "2025-11-04",
    description:
      "Replaced the sales-assisted setup flow with a guided self-serve checklist and sample workspace.",
    adoptionPctBefore: 18,
    adoptionPctAfter: 55,
    engagementLiftPct: 24,
    revenueImpactUsd: 42000,
    narrative:
      "New accounts reach their first workflow without a CS call, lifting activation and early expansion.",
    adoptionSeries: series([
      [-8, 18], [-6, 17], [-4, 18], [-2, 18],
      [0, 18], [2, 22], [4, 27], [6, 32], [8, 36], [10, 40], [12, 43],
      [14, 46], [16, 48], [18, 50], [20, 51], [22, 52], [24, 53],
      [26, 54], [28, 54], [30, 55], [32, 55], [34, 55],
    ]),
  },
  {
    id: "ini-003",
    name: "AI Release Notes Drafting",
    type: "AI",
    owner: "Elena Sokolova",
    launchDate: "2026-02-09",
    description:
      "Drafts customer-facing release notes from merged pull requests for PM review.",
    adoptionPctBefore: 8,
    adoptionPctAfter: 51,
    engagementLiftPct: 12,
    hoursSavedPerMonth: 22,
    costSavedPerMonthUsd: 22 * BLENDED_HOURLY_RATE_USD,
    revenueImpactUsd: 0,
    narrative:
      "PMs stopped writing notes from scratch; drafts ship with light edits, so usage spread team to team.",
    adoptionSeries: series([
      [-8, 8], [-6, 8], [-4, 7], [-2, 8],
      [0, 8], [2, 14], [4, 22], [6, 30], [8, 37], [10, 42], [12, 46],
      [14, 48], [16, 50], [18, 51], [20, 51],
    ]),
    agentOpsReviewId: "AGT-0151",
  },
  {
    id: "ini-004",
    name: "AI Support Ticket Summarizer",
    type: "AI",
    owner: "Dana Whitfield",
    launchDate: "2026-03-02",
    description:
      "Summarizes long support threads into a one-paragraph handoff for the next agent.",
    adoptionPctBefore: 15,
    adoptionPctAfter: 38,
    engagementLiftPct: 9,
    hoursSavedPerMonth: 14,
    costSavedPerMonthUsd: 14 * BLENDED_HOURLY_RATE_USD,
    revenueImpactUsd: 0,
    narrative:
      "Adoption is solid but concentrated in one support pod; the other pods still paste threads manually.",
    adoptionSeries: series([
      [-8, 15], [-6, 14], [-4, 15], [-2, 15],
      [0, 15], [2, 19], [4, 24], [6, 28], [8, 31], [10, 34], [12, 36],
      [14, 37], [16, 38],
    ]),
    agentOpsReviewId: "AGT-0162",
  },
  {
    id: "ini-005",
    name: "Usage-Based Pricing Migration",
    type: "Standard",
    owner: "Marcus Bell",
    launchDate: "2025-12-01",
    description:
      "Moved mid-tier plans from seat-based to usage-based pricing with in-product meters.",
    adoptionPctBefore: 30,
    adoptionPctAfter: 46,
    engagementLiftPct: 6,
    revenueImpactUsd: 58000,
    narrative:
      "Expansion revenue is strong, but fewer accounts opted into the new meters than the model assumed.",
    adoptionSeries: series([
      [-8, 30], [-6, 29], [-4, 30], [-2, 30],
      [0, 30], [2, 32], [4, 34], [6, 36], [8, 38], [10, 39], [12, 41],
      [14, 42], [16, 43], [18, 44], [20, 44], [22, 45], [24, 45],
      [26, 46], [28, 46], [30, 46],
    ]),
  },
  {
    id: "ini-006",
    name: "Mobile Push Re-engagement",
    type: "Standard",
    owner: "Jonah Kim",
    launchDate: "2026-01-26",
    description:
      "Push notifications nudging dormant mobile users back to their team's activity feed.",
    adoptionPctBefore: 22,
    adoptionPctAfter: 26,
    engagementLiftPct: -3,
    revenueImpactUsd: 3200,
    narrative:
      "Opt-out rates capped reach within two weeks; the users it did reach rarely returned twice.",
    adoptionSeries: series([
      [-8, 22], [-6, 22], [-4, 21], [-2, 22],
      [0, 22], [2, 27], [4, 29], [6, 28], [8, 27], [10, 26], [12, 25],
      [14, 26], [16, 26], [18, 25], [20, 26], [22, 26],
    ]),
  },
  {
    id: "ini-007",
    name: "In-App Gamification Badges",
    type: "Standard",
    owner: "Jonah Kim",
    launchDate: "2026-02-23",
    description:
      "Achievement badges awarded for completing common workflows, shown on the user profile.",
    adoptionPctBefore: 5,
    adoptionPctAfter: 9,
    engagementLiftPct: 1,
    revenueImpactUsd: 0,
    narrative:
      "Novelty faded within two weeks and badges never connected to anything users valued — sunset candidate.",
    adoptionSeries: series([
      [-8, 5], [-6, 5], [-4, 4], [-2, 5],
      [0, 5], [2, 8], [4, 9], [6, 10], [8, 9], [10, 9], [12, 8],
      [14, 9], [16, 9], [18, 9],
    ]),
  },
  {
    id: "ini-008",
    name: "AI Executive Brief Generator",
    type: "AI",
    owner: "Elena Sokolova",
    launchDate: "2026-04-06",
    description:
      "Generates a weekly product-health brief from dashboard metrics for leadership review.",
    adoptionPctBefore: 10,
    adoptionPctAfter: 41,
    engagementLiftPct: 15,
    hoursSavedPerMonth: 18,
    costSavedPerMonthUsd: 18 * BLENDED_HOURLY_RATE_USD,
    revenueImpactUsd: 0,
    narrative:
      "Leadership stopped requesting hand-built status decks once the Monday brief proved reliable.",
    adoptionSeries: series([
      [-8, 10], [-6, 10], [-4, 9], [-2, 10],
      [0, 10], [2, 17], [4, 25], [6, 31], [8, 36], [10, 39], [12, 41],
    ]),
    agentOpsReviewId: "AGT-0177",
  },
];

/** Weekly snapshots, Mondays, Jan–Jun 2026. */
export const engagementHistory: EngagementSnapshot[] = [
  { date: "2026-01-05", dau: 1420, wau: 3980, mau: 7810 },
  { date: "2026-01-12", dau: 1465, wau: 4030, mau: 7860 },
  { date: "2026-01-19", dau: 1440, wau: 4090, mau: 7920 },
  { date: "2026-01-26", dau: 1510, wau: 4150, mau: 7990 },
  { date: "2026-02-02", dau: 1535, wau: 4210, mau: 8040 },
  { date: "2026-02-09", dau: 1560, wau: 4260, mau: 8110 },
  { date: "2026-02-16", dau: 1540, wau: 4230, mau: 8150 },
  { date: "2026-02-23", dau: 1610, wau: 4340, mau: 8230 },
  { date: "2026-03-02", dau: 1655, wau: 4420, mau: 8310 },
  { date: "2026-03-09", dau: 1700, wau: 4480, mau: 8390 },
  { date: "2026-03-16", dau: 1685, wau: 4460, mau: 8450 },
  { date: "2026-03-23", dau: 1745, wau: 4550, mau: 8540 },
  { date: "2026-03-30", dau: 1790, wau: 4620, mau: 8620 },
  { date: "2026-04-06", dau: 1820, wau: 4700, mau: 8710 },
  { date: "2026-04-13", dau: 1805, wau: 4680, mau: 8760 },
  { date: "2026-04-20", dau: 1870, wau: 4770, mau: 8850 },
  { date: "2026-04-27", dau: 1920, wau: 4850, mau: 8930 },
  { date: "2026-05-04", dau: 1950, wau: 4910, mau: 9010 },
  { date: "2026-05-11", dau: 1935, wau: 4890, mau: 9060 },
  { date: "2026-05-18", dau: 1990, wau: 4970, mau: 9150 },
  { date: "2026-05-25", dau: 1960, wau: 4940, mau: 9190 },
  { date: "2026-06-01", dau: 2030, wau: 5040, mau: 9280 },
  { date: "2026-06-08", dau: 2075, wau: 5110, mau: 9360 },
  { date: "2026-06-15", dau: 2100, wau: 5160, mau: 9450 },
  { date: "2026-06-22", dau: 2085, wau: 5140, mau: 9520 },
  { date: "2026-06-29", dau: 2140, wau: 5230, mau: 9640 },
];

/**
 * Month-end snapshots, Jan–Jun 2026. Each month's mrr equals the prior
 * month's mrr + newMrr + expansionMrr − contractionMrr − churnedMrr.
 */
export const revenueHistory: RevenueSnapshot[] = [
  { date: "2026-01-31", mrr: 412000, newMrr: 16800, expansionMrr: 11200, contractionMrr: 3900, churnedMrr: 5400 },
  { date: "2026-02-28", mrr: 429000, newMrr: 14900, expansionMrr: 12800, contractionMrr: 4600, churnedMrr: 6100 },
  { date: "2026-03-31", mrr: 451400, newMrr: 17400, expansionMrr: 14100, contractionMrr: 3800, churnedMrr: 5300 },
  { date: "2026-04-30", mrr: 466700, newMrr: 12600, expansionMrr: 15800, contractionMrr: 5200, churnedMrr: 7900 },
  { date: "2026-05-31", mrr: 486800, newMrr: 13800, expansionMrr: 16400, contractionMrr: 4100, churnedMrr: 6000 },
  { date: "2026-06-30", mrr: 509900, newMrr: 15200, expansionMrr: 17900, contractionMrr: 4400, churnedMrr: 5600 },
];

/** Trailing-90-day signup cohort. */
export const adoptionFunnel: AdoptionFunnelStage[] = [
  { stage: "Signed Up", count: 12400 },
  { stage: "Activated", count: 7940 },
  { stage: "Habitual", count: 4310 },
];

/** Current monthly active base (matches the latest MAU snapshot). */
export const userSegments: UserSegmentBreakdown[] = [
  { segment: "Power", userCount: 1350, pctOfBase: 14.0 },
  { segment: "Core", userCount: 3280, pctOfBase: 34.0 },
  { segment: "Casual", userCount: 2700, pctOfBase: 28.0 },
  { segment: "At Risk", userCount: 1250, pctOfBase: 13.0 },
  { segment: "Dormant", userCount: 1060, pctOfBase: 11.0 },
];

/**
 * Monthly activation cohorts: of the users who activated in a given
 * month, the share still active N months later. The three most recent
 * cohorts sum to the funnel's trailing-90-day Activated count, and the
 * improving early-retention curve tracks the initiatives shipped over
 * the period (notably the Self-Serve Onboarding Redesign).
 */
export const cohortRetention: CohortRetention[] = [
  { cohort: "2026-01", activatedUsers: 2210, retentionPct: [100, 58, 47, 41, 37, 34] },
  { cohort: "2026-02", activatedUsers: 2340, retentionPct: [100, 61, 50, 44, 40] },
  { cohort: "2026-03", activatedUsers: 2480, retentionPct: [100, 65, 55, 48] },
  { cohort: "2026-04", activatedUsers: 2570, retentionPct: [100, 70, 61] },
  { cohort: "2026-05", activatedUsers: 2650, retentionPct: [100, 75] },
  { cohort: "2026-06", activatedUsers: 2720, retentionPct: [100] },
];

/**
 * Usage signals per segment, current month. mrrUsd across all segments
 * sums to the latest month-end MRR. Churn-risk tiers are computed from
 * these numbers by src/lib/churn-risk.ts — never stored.
 */
export const segmentRiskSignals: SegmentRiskSignal[] = [
  { segment: "Power", avgSessionsPerWeek: 9.5, medianDaysSinceLastActive: 1, seatUtilizationPct: 92, mrrUsd: 168000 },
  { segment: "Core", avgSessionsPerWeek: 4.2, medianDaysSinceLastActive: 3, seatUtilizationPct: 74, mrrUsd: 214000 },
  { segment: "Casual", avgSessionsPerWeek: 1.2, medianDaysSinceLastActive: 9, seatUtilizationPct: 41, mrrUsd: 82000 },
  { segment: "At Risk", avgSessionsPerWeek: 0.4, medianDaysSinceLastActive: 19, seatUtilizationPct: 22, mrrUsd: 33000 },
  { segment: "Dormant", avgSessionsPerWeek: 0.1, medianDaysSinceLastActive: 47, seatUtilizationPct: 9, mrrUsd: 12900 },
];
