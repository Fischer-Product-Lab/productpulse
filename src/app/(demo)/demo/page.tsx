import Link from "next/link";

import { NeedsAttentionList } from "@/components/brief/needs-attention-list";
import { NorthStarChart } from "@/components/brief/north-star-chart";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { METRIC_DEFS } from "@/data/glossary";
import {
  adoptionFunnel,
  engagementHistory,
  initiatives,
  revenueHistory,
} from "@/data/productpulse";
import { computeImpact } from "@/lib/impact";

const attentionRank = { Underperforming: 0, Monitor: 1, "Strong Impact": 2 };

export default function BriefPage() {
  const latest = engagementHistory[engagementHistory.length - 1];
  const first = engagementHistory[0];

  // Same formulas as the detail screens, so the brief can never disagree.
  const [signedUp, activated] = adoptionFunnel;
  const activationRate = (activated.count / signedUp.count) * 100;
  const stickiness = (latest.dau / latest.mau) * 100;

  const latestRev = revenueHistory[revenueHistory.length - 1];
  const priorRev = revenueHistory[revenueHistory.length - 2];
  const nrr =
    ((priorRev.mrr +
      latestRev.expansionMrr -
      latestRev.contractionMrr -
      latestRev.churnedMrr) /
      priorRev.mrr) *
    100;

  const aiHoursSaved = initiatives
    .filter((i) => i.type === "AI")
    .reduce((sum, i) => sum + (i.hoursSavedPerMonth ?? 0), 0);

  const wauGrowthPct = ((latest.wau - first.wau) / first.wau) * 100;

  const needsAttention = initiatives
    .map((initiative) => ({ initiative, impact: computeImpact(initiative) }))
    .filter(({ impact }) => impact.status !== "Strong Impact")
    .sort(
      (a, b) =>
        attentionRank[a.impact.status] - attentionRank[b.impact.status] ||
        a.impact.adoptionLiftPts - b.impact.adoptionLiftPts,
    );

  return (
    <>
      <PageHeader
        eyebrow="Executive Brief"
        title="The state of the product, in one screen"
        description="The North Star metric, headline KPIs, and anything that needs an executive's attention this cycle — every figure computed from the same data as the detail screens."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/adoption" className="group">
          <StatCard
            label="Activation rate"
            value={`${activationRate.toFixed(1)}%`}
            hint="Signed Up → Activated · trailing 90 days"
            definition={METRIC_DEFS.activationRate}
            className="h-full transition-colors group-hover:border-gold/40"
          />
        </Link>
        <Link href="/engagement" className="group">
          <StatCard
            label="Stickiness"
            value={`${stickiness.toFixed(1)}%`}
            hint="DAU ÷ MAU, latest week"
            definition={METRIC_DEFS.stickiness}
            className="h-full transition-colors group-hover:border-gold/40"
          />
        </Link>
        <Link href="/revenue" className="group">
          <StatCard
            label="Net revenue retention"
            value={`${nrr.toFixed(1)}%`}
            hint="June, existing-base retention"
            definition={METRIC_DEFS.nrr}
            className="h-full transition-colors group-hover:border-gold/40"
          />
        </Link>
        <Link href="/revenue" className="group">
          <StatCard
            label="AI hours saved / mo"
            value={`${aiHoursSaved} h`}
            hint="Across 4 shipped AI initiatives"
            definition={METRIC_DEFS.aiCostSavings}
            className="h-full transition-colors group-hover:border-gold/40"
          />
        </Link>
      </div>

      <section className="mb-6 rounded-xl border border-gold/25 bg-card px-5 py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold">
              North Star
            </p>
            <h2 className="mt-1 font-heading text-base font-semibold tracking-tight">
              Weekly Active Users
            </h2>
          </div>
          <p className="font-heading text-2xl font-semibold tracking-tight">
            {latest.wau.toLocaleString("en-US")}
            <span className="ml-2 align-middle font-sans text-xs font-normal text-success">
              +{wauGrowthPct.toFixed(1)}% since January
            </span>
          </p>
        </div>
        <div className="mt-4">
          <NorthStarChart history={engagementHistory} />
        </div>
        <p className="sr-only">
          Weekly Active Users grew from {first.wau.toLocaleString("en-US")} in
          January 2026 to {latest.wau.toLocaleString("en-US")} in June 2026.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-heading text-base font-semibold tracking-tight">
              Needs attention
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Initiatives rated Monitor or Underperforming by the impact engine.
            </p>
          </div>
          <Link
            href="/initiatives"
            className="text-xs font-medium text-gold transition-colors hover:text-gold-light"
          >
            Full registry →
          </Link>
        </div>
        <NeedsAttentionList items={needsAttention} />
      </section>
    </>
  );
}
