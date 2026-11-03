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
            href={`/initiatives#${initiative.id}`}
            aria-label={`Review ${initiative.name}: ${impact.status}, ${impact.adoptionLiftPts} point adoption lift`}
            className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-5 transition-colors hover:bg-accent/40 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:px-6"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{initiative.name}</span>
                <InitiativeTypeBadge type={initiative.type} />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {initiative.narrative}
              </p>
            </div>
            <div className="col-start-1 flex flex-wrap items-center gap-x-3 gap-y-2 sm:col-start-auto sm:flex-col sm:items-end">
              <ImpactStatusBadge status={impact.status} />
              <span
                className={cn(
                  "font-mono text-xs",
                  impact.adoptionLiftPts < 5
                    ? "text-danger"
                    : "text-muted-foreground",
                )}
              >
                {impact.adoptionLiftPts > 0 ? "+" : ""}
                {impact.adoptionLiftPts} pts adoption
              </span>
            </div>
            <ChevronRight
              aria-hidden
              className="col-start-2 row-start-1 size-4 shrink-0 text-gold transition-transform group-hover:translate-x-0.5 sm:col-start-3"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
