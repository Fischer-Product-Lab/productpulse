import type { SegmentRiskSignal } from "@/data/productpulse";

export type ChurnRiskTier = "Low" | "Elevated" | "High";

export interface ChurnRiskResult {
  tier: ChurnRiskTier;
  reasons: string[];
}

/**
 * Deterministic churn-risk rating from stored usage signals — same
 * contract as computeImpact: same inputs, same tier, always. The UI
 * only ever displays what this function returns.
 *
 * High:     inactive 30+ days, or under 0.5 sessions/week while
 *           inactive 14+ days.
 * Elevated: under 2 sessions/week, inactive 7+ days, or seat
 *           utilization under 30%.
 * Low:      everything else.
 */
export function computeChurnRisk(s: SegmentRiskSignal): ChurnRiskResult {
  const highReasons: string[] = [];
  if (s.medianDaysSinceLastActive >= 30) {
    highReasons.push(
      `No meaningful activity in ${s.medianDaysSinceLastActive} days (threshold: 30)`,
    );
  }
  if (s.avgSessionsPerWeek < 0.5 && s.medianDaysSinceLastActive >= 14) {
    highReasons.push(
      `Under 0.5 sessions/week and inactive ${s.medianDaysSinceLastActive}+ days`,
    );
  }
  if (highReasons.length > 0) {
    return { tier: "High", reasons: highReasons };
  }

  const elevatedReasons: string[] = [];
  if (s.avgSessionsPerWeek < 2) {
    elevatedReasons.push(
      `${s.avgSessionsPerWeek} sessions/week is below the 2/week habit line`,
    );
  }
  if (s.medianDaysSinceLastActive >= 7) {
    elevatedReasons.push(
      `Median ${s.medianDaysSinceLastActive} days since last activity (threshold: 7)`,
    );
  }
  if (s.seatUtilizationPct < 30) {
    elevatedReasons.push(
      `Only ${s.seatUtilizationPct}% of purchased seats in use (threshold: 30%)`,
    );
  }
  if (elevatedReasons.length > 0) {
    return { tier: "Elevated", reasons: elevatedReasons };
  }

  return {
    tier: "Low",
    reasons: ["Healthy usage frequency, recency, and seat utilization"],
  };
}
