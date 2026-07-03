import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { METRIC_DEFS } from "@/data/glossary";
import { MrrMovementChart } from "@/components/revenue/mrr-movement-chart";
import { MrrTrendChart } from "@/components/revenue/mrr-trend-chart";
import { StatCard } from "@/components/stat-card";
import {
  BLENDED_HOURLY_RATE_USD,
  initiatives,
  revenueHistory,
} from "@/data/productpulse";

export const metadata: Metadata = { title: "Revenue" };

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function RevenuePage() {
  const latest = revenueHistory[revenueHistory.length - 1];
  const prior = revenueHistory[revenueHistory.length - 2];

  const latestMonth = new Date(`${latest.date}T00:00:00Z`).toLocaleDateString(
    "en-US",
    { month: "long", timeZone: "UTC" },
  );

  // Monthly NRR: existing-base retention, so new business is excluded.
  const nrr =
    ((prior.mrr + latest.expansionMrr - latest.contractionMrr - latest.churnedMrr) /
      prior.mrr) *
    100;
  const netChange =
    latest.newMrr + latest.expansionMrr - latest.contractionMrr - latest.churnedMrr;

  const aiInitiatives = initiatives.filter(
    (i) => i.type === "AI" && (i.hoursSavedPerMonth ?? 0) > 0,
  );
  const totalHoursSaved = aiInitiatives.reduce(
    (sum, i) => sum + (i.hoursSavedPerMonth ?? 0),
    0,
  );
  const totalCostSaved = totalHoursSaved * BLENDED_HOURLY_RATE_USD;

  return (
    <>
      <PageHeader
        eyebrow="Revenue & Business Impact"
        title="What the product earns, and what it saves"
        description="MRR trajectory, the expansion and contraction underneath it, net revenue retention, and the cost savings attributable to AI initiatives."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="MRR"
          value={usd.format(latest.mrr)}
          hint={`${latestMonth}, up from ${usd.format(prior.mrr)}`}
          definition={METRIC_DEFS.mrr}
        />
        <StatCard
          label="Net revenue retention"
          value={`${nrr.toFixed(1)}%`}
          hint={`${latestMonth} · (start + expansion − contraction − churn) ÷ start`}
          definition={METRIC_DEFS.nrr}
          className="border-gold/35"
          valueClassName="text-gold-gradient"
        />
        <StatCard
          label={`Net new MRR (${latestMonth})`}
          value={`${netChange >= 0 ? "+" : ""}${usd.format(netChange)}`}
          hint="New + expansion − contraction − churn"
          definition={METRIC_DEFS.netNewMrr}
        />
        <StatCard
          label="AI cost savings / mo"
          value={usd.format(totalCostSaved)}
          hint={`${totalHoursSaved} hrs × $${BLENDED_HOURLY_RATE_USD} blended rate`}
          definition={METRIC_DEFS.aiCostSavings}
        />
      </div>

      <section className="mb-6 rounded-xl border border-border bg-card px-5 py-4">
        <h2 className="font-heading text-base font-semibold tracking-tight">
          MRR trend
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Month-end MRR, January–June 2026.
        </p>
        <div className="mt-4">
          <MrrTrendChart history={revenueHistory} />
        </div>
        <p className="sr-only">
          MRR grew from {usd.format(revenueHistory[0].mrr)} in January 2026 to{" "}
          {usd.format(latest.mrr)} in June 2026.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-border bg-card px-5 py-4">
          <h2 className="font-heading text-base font-semibold tracking-tight">
            MRR movement
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Monthly new, expansion, contraction, and churned MRR.
          </p>
          <div className="mt-4">
            <MrrMovementChart history={revenueHistory} />
          </div>
          <ul className="sr-only">
            {revenueHistory.map((s) => (
              <li key={s.date}>
                {s.date}: new {usd.format(s.newMrr)}, expansion{" "}
                {usd.format(s.expansionMrr)}, contraction{" "}
                {usd.format(s.contractionMrr)}, churned {usd.format(s.churnedMrr)}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-gold/25 bg-card px-5 py-4">
          <h2 className="font-heading text-base font-semibold tracking-tight">
            AI cost savings
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            hoursSavedPerMonth × ${BLENDED_HOURLY_RATE_USD}/hr blended rate, per
            AI initiative.
          </p>
          <ul className="mt-4 space-y-3">
            {aiInitiatives.map((i) => (
              <li
                key={i.id}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="min-w-0 truncate">{i.name}</span>
                <span className="shrink-0 font-mono text-muted-foreground">
                  {i.hoursSavedPerMonth} h ·{" "}
                  <span className="text-foreground">
                    {usd.format((i.hoursSavedPerMonth ?? 0) * BLENDED_HOURLY_RATE_USD)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-3">
            <span className="text-sm font-medium">Total / month</span>
            <span className="font-heading text-xl font-semibold text-gold-gradient">
              {usd.format(totalCostSaved)}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {totalHoursSaved} hours across {aiInitiatives.length} AI initiatives —
            statuses computed in the initiative registry.
          </p>
        </section>
      </div>
    </>
  );
}
