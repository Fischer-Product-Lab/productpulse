import { describe, expect, it } from "vitest";
import { initiatives } from "@/data/productpulse";
import { summarizeInitiatives } from "@/lib/initiative-summary";
import { computeImpact } from "@/lib/impact";

describe("executive review summary", () => {
  it("counts only engine-derived statuses and accounts for every initiative", () => {
    const summary = summarizeInitiatives(initiatives);
    expect(summary.total).toBe(8);
    expect(summary.counts).toEqual({
      "Strong Impact": 4,
      Monitor: 2,
      Underperforming: 2,
    });
    expect(
      Object.values(summary.counts).reduce((sum, count) => sum + count, 0),
    ).toBe(summary.total);
    for (const item of summary.needsAttention)
      expect(item.impact).toEqual(computeImpact(item.initiative));
  });

  it("places underperforming work before monitoring and sorts by lift", () => {
    const queue = summarizeInitiatives(initiatives).needsAttention;
    expect(queue.map(({ initiative }) => initiative.id)).toEqual([
      "ini-006",
      "ini-007",
      "ini-005",
      "ini-004",
    ]);
  });

  it("does not mutate input and handles an empty portfolio", () => {
    const original = initiatives.map((initiative) => initiative.id);
    summarizeInitiatives(initiatives);
    expect(initiatives.map((initiative) => initiative.id)).toEqual(original);
    expect(summarizeInitiatives([])).toEqual({
      total: 0,
      needsAttention: [],
      counts: { "Strong Impact": 0, Monitor: 0, Underperforming: 0 },
    });
  });
});
