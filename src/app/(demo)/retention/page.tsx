import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ChurnRiskTable } from "@/components/retention/churn-risk-table";
import { CohortCurvesChart } from "@/components/retention/cohort-curves-chart";
import { CohortTable } from "@/components/retention/cohort-table";
import { StatCard } from "@/components/stat-card";
import { METRIC_DEFS } from "@/data/glossary";
import {
  cohortRetention,
  segmentRiskSignals,
  userSegments,
} from "@/data/productpulse";
import { computeChurnRisk } from "@/lib/churn-risk";

export const metadata: Metadata = { title: "Retention" };

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function RetentionPage() {
  // M1 retention: newest cohort with at least one full month observed.
  const withM1 = cohortRetention.filter((c) => c.retentionPct.length >= 2);
  const newestM1 = withM1[withM1.length - 1];
  const oldestM1 = withM1[0];
  const m1Delta = newestM1.retentionPct[1] - oldestM1.retentionPct[1];

  const riskRows = segmentRiskSignals.map((signal) => ({
    signal,
    risk: computeChurnRisk(signal),
    userCount:
      userSegments.find((s) => s.segment === signal.segment)?.userCount ?? 0,
  }));

  const highRisk = riskRows.filter(({ risk }) => risk.tier === "High");
  const highRiskMrr = highRisk.reduce((sum, r) => sum + r.signal.mrrUsd, 0);
  const highRiskUsers = highRisk.reduce((sum, r) => sum + r.userCount, 0);
  const totalMrr = segmentRiskSignals.reduce((sum, s) => sum + s.mrrUsd, 0);
  const totalUsers = userSegments.reduce((sum, s) => sum + s.userCount, 0);

  return (
    <>
      <PageHeader
        eyebrow="Retention & Churn Risk"
        title="Who stays, and who's slipping away"
        description="How each activation cohort holds on over time, and where churn risk concentrates across the user base — risk tiers computed deterministically from usage signals, never guessed."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="M1 retention, May cohort"
          value={`${newestM1.retentionPct[1]}%`}
          hint={`+${m1Delta} pts vs the January cohort`}
          definition={METRIC_DEFS.cohortRetention}
          className="border-gold/35"
          valueClassName="text-gold-gradient"
        />
        <StatCard
          label="M1 retention, Jan cohort"
          value={`${oldestM1.retentionPct[1]}%`}
          hint="Before the onboarding redesign matured"
          definition={METRIC_DEFS.cohortRetention}
        />
        <StatCard
          label="MRR in high-risk segments"
          value={usd.format(highRiskMrr)}
          hint={`${((highRiskMrr / totalMrr) * 100).toFixed(1)}% of total MRR`}
          definition={METRIC_DEFS.churnRisk}
        />
        <StatCard
          label="High-risk users"
          value={highRiskUsers.toLocaleString("en-US")}
          hint={`${((highRiskUsers / totalUsers) * 100).toFixed(0)}% of the monthly active base`}
          definition={METRIC_DEFS.churnRisk}
        />
      </div>

      <section className="mb-6 rounded-xl border border-border bg-card px-5 py-4">
        <h2 className="font-heading text-base font-semibold tracking-tight">
          Cohort retention curves
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Share of each monthly activation cohort still active, by months since
          activation. Newer cohorts are brighter — and retaining better.
        </p>
        <div className="mt-4">
          <CohortCurvesChart cohorts={cohortRetention} />
        </div>
        <ul className="sr-only">
          {cohortRetention.map((c) => (
            <li key={c.cohort}>
              {c.cohort} cohort ({c.activatedUsers.toLocaleString("en-US")}{" "}
              activated): {c.retentionPct.map((p, m) => `M${m} ${p}%`).join(", ")}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-semibold tracking-tight">
            Retention by cohort
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            The same curves as a triangle — read across a row to follow one
            cohort through time.
          </p>
        </div>
        <CohortTable cohorts={cohortRetention} />
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-semibold tracking-tight">
            Churn risk by segment
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {usd.format(highRiskMrr)} of MRR sits in high-risk segments (
            {highRiskUsers.toLocaleString("en-US")} users). Hover a tier for the
            signals behind it.
          </p>
        </div>
        <ChurnRiskTable rows={riskRows} />
      </section>
    </>
  );
}
