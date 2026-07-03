import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { Initiative } from "@/data/productpulse";
import type { ImpactResult } from "@/lib/impact";
import { ImpactStatusBadge } from "@/components/impact-status-badge";
import { InitiativeTypeBadge } from "@/components/initiative-type-badge";
import { cn } from "@/lib/utils";

export function NeedsAttentionList({
  items,
}: {
  items: { initiative: Initiative; impact: ImpactResult }[];
}) {
  return (
    <ul className="divide-y divide-border">
      {items.map(({ initiative, impact }) => (
        <li key={initiative.id}>
          <Link
            href="/initiatives"
            className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accent/40"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{initiative.name}</span>
                <InitiativeTypeBadge type={initiative.type} />
              </div>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {initiative.narrative}
              </p>
            </div>
            <span
              className={cn(
                "hidden shrink-0 font-mono text-sm sm:inline",
                impact.adoptionLiftPts < 5 ? "text-danger" : "text-foreground",
              )}
            >
              {impact.adoptionLiftPts > 0 ? "+" : ""}
              {impact.adoptionLiftPts} pts
            </span>
            <ImpactStatusBadge status={impact.status} className="shrink-0" />
            <ChevronRight
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
