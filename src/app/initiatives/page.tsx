import type { Metadata } from "next";

import { InitiativeCard } from "@/components/initiatives/initiative-card";
import { PageHeader } from "@/components/layout/page-header";
import { initiatives, type ImpactStatus } from "@/data/productpulse";
import { computeImpact } from "@/lib/impact";

export const metadata: Metadata = { title: "Initiatives" };

const statusOrder: ImpactStatus[] = [
  "Strong Impact",
  "Monitor",
  "Underperforming",
];

export default function InitiativesPage() {
  const registry = initiatives
    .map((initiative) => ({ initiative, impact: computeImpact(initiative) }))
    .sort((a, b) => b.impact.adoptionLiftPts - a.impact.adoptionLiftPts);

  const statusCounts = registry.reduce<Record<ImpactStatus, number>>(
    (acc, { impact }) => {
      acc[impact.status] += 1;
      return acc;
    },
    { "Strong Impact": 0, Monitor: 0, Underperforming: 0 },
  );
  const aiCount = initiatives.filter((i) => i.type === "AI").length;

  return (
    <>
      <PageHeader
        eyebrow="Initiative Registry"
        title="What we shipped — and whether it worked"
        description="Every shipped initiative, AI and standard alike, traced to the metric movement that followed. Impact status is computed deterministically from the numbers — click any initiative for the reasoning."
      />

      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border bg-card/40 px-5 py-3 text-sm">
        <span className="font-medium">
          {registry.length} initiatives
          <span className="ml-2 font-normal text-muted-foreground">
            {aiCount} AI · {registry.length - aiCount} Standard
          </span>
        </span>
        <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />
        {statusOrder.map((status) => (
          <span key={status} className="flex items-center gap-2">
            <span
              aria-hidden
              className={
                status === "Strong Impact"
                  ? "size-2 rounded-full bg-success"
                  : status === "Monitor"
                    ? "size-2 rounded-full bg-warning"
                    : "size-2 rounded-full bg-danger"
              }
            />
            <span className="text-muted-foreground">
              {statusCounts[status]} {status}
            </span>
          </span>
        ))}
      </div>

      <p className="mb-3 text-xs text-muted-foreground">
        Ranked by adoption lift since launch.
      </p>

      <div className="space-y-3">
        {registry.map(({ initiative, impact }) => (
          <InitiativeCard
            key={initiative.id}
            initiative={initiative}
            impact={impact}
          />
        ))}
      </div>
    </>
  );
}
