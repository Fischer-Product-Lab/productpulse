import type { ImpactStatus, Initiative } from "@/data/productpulse";
import { computeImpact } from "@/lib/impact";

const attentionRank: Record<ImpactStatus, number> = {
  Underperforming: 0,
  Monitor: 1,
  "Strong Impact": 2,
};

/** Derive the executive review queue from the same engine as the registry. */
export function summarizeInitiatives(initiatives: Initiative[]) {
  const evaluated = initiatives.map((initiative) => ({
    initiative,
    impact: computeImpact(initiative),
  }));
  const counts = evaluated.reduce<Record<ImpactStatus, number>>(
    (result, { impact }) => {
      result[impact.status] += 1;
      return result;
    },
    { "Strong Impact": 0, Monitor: 0, Underperforming: 0 },
  );
  const needsAttention = evaluated
    .filter(({ impact }) => impact.status !== "Strong Impact")
    .sort(
      (a, b) =>
        attentionRank[a.impact.status] - attentionRank[b.impact.status] ||
        a.impact.adoptionLiftPts - b.impact.adoptionLiftPts,
    );
  return { counts, needsAttention, total: evaluated.length };
}
