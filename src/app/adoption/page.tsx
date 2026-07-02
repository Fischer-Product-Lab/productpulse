import type { Metadata } from "next";

import { AdoptionFunnelChart } from "@/components/adoption/adoption-funnel-chart";
import { InitiativeAdoptionTable } from "@/components/adoption/initiative-adoption-table";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { adoptionFunnel, initiatives } from "@/data/productpulse";
import { computeImpact } from "@/lib/impact";

export const metadata: Metadata = { title: "Adoption" };

const pct = (num: number, den: number) => `${((num / den) * 100).toFixed(1)}%`;

export default function AdoptionPage() {
  const [signedUp, activated, habitual] = adoptionFunnel;

  const rows = initiatives
    .map((initiative) => ({ initiative, impact: computeImpact(initiative) }))
    .sort((a, b) => b.initiative.adoptionPctAfter - a.initiative.adoptionPctAfter);

  return (
    <>
      <PageHeader
        eyebrow="Adoption & Activation"
        title="From signup to habit"
        description="How new accounts move through the Signed Up → Activated → Habitual funnel, and how quickly shipped initiatives are being picked up."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Activation rate"
          value={pct(activated.count, signedUp.count)}
          hint="Signed Up → Activated"
        />
        <StatCard
          label="Habit rate"
          value={pct(habitual.count, activated.count)}
          hint="Activated → Habitual"
        />
        <StatCard
          label="Signup → habit"
          value={pct(habitual.count, signedUp.count)}
          hint="End-to-end funnel conversion"
        />
      </div>

      <section className="mb-6 rounded-xl border border-border bg-card px-5 py-4">
        <h2 className="font-heading text-base font-semibold tracking-tight">
          Activation funnel
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Trailing 90-day signup cohort.
        </p>
        <div className="mt-4">
          <AdoptionFunnelChart stages={adoptionFunnel} />
        </div>
        <ul className="sr-only">
          {adoptionFunnel.map((s) => (
            <li key={s.stage}>
              {s.stage}: {s.count.toLocaleString("en-US")} users
            </li>
          ))}
        </ul>
      </section>

      <InitiativeAdoptionTable rows={rows} />
    </>
  );
}
