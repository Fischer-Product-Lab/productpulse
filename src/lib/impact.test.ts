import { describe, expect, it } from "vitest";

import {
  initiatives,
  revenueHistory,
  userSegments,
  type ImpactStatus,
} from "@/data/productpulse";
import { computeImpact } from "@/lib/impact";

/**
 * Expected statuses per the build kit's Section 7 table. ini-006's
 * adoptionPctAfter is seeded as 26 (not the kit's 27, an off-by-one at
 * the boundary: a lift of exactly 5 rates Monitor under Section 6's
 * `lift < 5` rule) so the table's intended status spread reproduces.
 */
const expectedStatuses: Record<string, ImpactStatus> = {
  "ini-001": "Strong Impact",
  "ini-002": "Strong Impact",
  "ini-003": "Strong Impact",
  "ini-004": "Monitor",
  "ini-005": "Monitor",
  "ini-006": "Underperforming",
  "ini-007": "Underperforming",
  "ini-008": "Strong Impact",
};

describe("computeImpact", () => {
  it("covers all seeded initiatives", () => {
    expect(initiatives.map((i) => i.id).sort()).toEqual(
      Object.keys(expectedStatuses).sort(),
    );
  });

  for (const initiative of initiatives) {
    it(`rates ${initiative.id} (${initiative.name}) as ${expectedStatuses[initiative.id]}`, () => {
      const result = computeImpact(initiative);
      expect(result.status).toBe(expectedStatuses[initiative.id]);
      expect(result.adoptionLiftPts).toBe(
        initiative.adoptionPctAfter - initiative.adoptionPctBefore,
      );
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  }

  it("is deterministic — same input, same result", () => {
    for (const initiative of initiatives) {
      expect(computeImpact(initiative)).toEqual(computeImpact(initiative));
    }
  });
});

describe("synthetic dataset consistency", () => {
  it("each month's MRR equals prior MRR plus that month's movement", () => {
    for (let n = 1; n < revenueHistory.length; n++) {
      const prev = revenueHistory[n - 1];
      const cur = revenueHistory[n];
      expect(cur.mrr).toBe(
        prev.mrr +
          cur.newMrr +
          cur.expansionMrr -
          cur.contractionMrr -
          cur.churnedMrr,
      );
    }
  });

  it("user segments cover the whole base", () => {
    const totalPct = userSegments.reduce((sum, s) => sum + s.pctOfBase, 0);
    expect(totalPct).toBeCloseTo(100, 1);
  });
});
