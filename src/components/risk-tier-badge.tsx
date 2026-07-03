import type { ChurnRiskTier } from "@/lib/churn-risk";
import { cn } from "@/lib/utils";

const tierStyles: Record<ChurnRiskTier, string> = {
  Low: "border-success/35 bg-success/10 text-success",
  Elevated: "border-warning/35 bg-warning/10 text-warning",
  High: "border-danger/35 bg-danger/10 text-danger",
};

export function RiskTierBadge({
  tier,
  className,
}: {
  tier: ChurnRiskTier;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-xs font-medium",
        tierStyles[tier],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {tier}
    </span>
  );
}
