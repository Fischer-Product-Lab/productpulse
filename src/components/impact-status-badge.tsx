import type { ImpactStatus } from "@/data/productpulse";
import { cn } from "@/lib/utils";

const statusStyles: Record<ImpactStatus, string> = {
  "Strong Impact": "border-success/35 bg-success/10 text-success",
  Monitor: "border-warning/35 bg-warning/10 text-warning",
  Underperforming: "border-danger/35 bg-danger/10 text-danger",
};

export function ImpactStatusBadge({
  status,
  className,
}: {
  status: ImpactStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
