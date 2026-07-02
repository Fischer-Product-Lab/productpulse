import type { ImpactStatus, Initiative } from "@/data/productpulse";

export interface ImpactResult {
  status: ImpactStatus;
  adoptionLiftPts: number;   // adoptionPctAfter - adoptionPctBefore
  reasons: string[];
}

export function computeImpact(i: Initiative): ImpactResult {
  const lift = i.adoptionPctAfter - i.adoptionPctBefore;
  const hasMeaningfulOutcome =
    (i.hoursSavedPerMonth ?? 0) > 5 || (i.revenueImpactUsd ?? 0) > 1000;

  if (lift >= 25 && hasMeaningfulOutcome) {
    return {
      status: "Strong Impact",
      adoptionLiftPts: lift,
      reasons: ["Adoption lift ≥25 pts with a measurable business outcome"],
    };
  }
  if (lift < 5) {
    return {
      status: "Underperforming",
      adoptionLiftPts: lift,
      reasons: ["Adoption lift under 5 pts since launch — investigate or sunset"],
    };
  }
  return {
    status: "Monitor",
    adoptionLiftPts: lift,
    reasons: ["Positive but modest movement — keep watching next cycle"],
  };
}
