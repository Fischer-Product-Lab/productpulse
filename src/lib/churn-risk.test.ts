import { describe, expect, it } from "vitest";

import {
  adoptionFunnel,
  cohortRetention,
  revenueHistory,
  segmentRiskSignals,
  type UserSegment,
} from "@/data/productpulse";
import { computeChurnRisk, type ChurnRiskTier } from "@/lib/churn-risk";

const expectedTiers: Record<UserSegment, ChurnRiskTier> = {
  Power: "Low",
  Core: "Low",
  Casual: "Elevated",
  "At Risk": "High",
  Dormant: "High",
};

describe("computeChurnRisk", () => {
  it("covers all seeded segments", () => {
    expect(segmentRiskSignals.map((s) => s.segment).sort()).toEqual(
      (Object.keys(expectedTiers) as UserSegment[]).sort(),
    );
  });

  for (const signal of segmentRiskSignals) {
    it(`rates ${signal.segment} as ${expectedTiers[signal.segment]}`, () => {
      const result = computeChurnRisk(signal);
      expect(result.tier).toBe(expectedTiers[signal.segment]);
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  }

  it("is deterministic — same input, same result", () => {
    for (const signal of segmentRiskSignals) {
      expect(computeChurnRisk(signal)).toEqual(computeChurnRisk(signal));
    }
  });
});

describe("retention dataset consistency", () => {
  it("every cohort starts at 100% and never increases", () => {
    for (const c of cohortRetention) {
      expect(c.retentionPct[0]).toBe(100);
      for (let m = 1; m < c.retentionPct.length; m++) {
        expect(c.retentionPct[m]).toBeLessThanOrEqual(c.retentionPct[m - 1]);
      }
    }
  });

  it("each cohort has exactly the months observable through June 2026", () => {
    cohortRetention.forEach((c, i) => {
      expect(c.retentionPct.length).toBe(cohortRetention.length - i);
    });
  });

  it("the three newest cohorts sum to the funnel's trailing-90-day Activated count", () => {
    const recent = cohortRetention
      .slice(-3)
      .reduce((sum, c) => sum + c.activatedUsers, 0);
    const activated = adoptionFunnel.find((s) => s.stage === "Activated");
    expect(recent).toBe(activated?.count);
  });

  it("segment MRR attribution sums to the latest month-end MRR", () => {
    const total = segmentRiskSignals.reduce((sum, s) => sum + s.mrrUsd, 0);
    expect(total).toBe(revenueHistory[revenueHistory.length - 1].mrr);
  });
});
