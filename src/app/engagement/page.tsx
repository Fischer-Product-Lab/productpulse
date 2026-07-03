import type { Metadata } from "next";

import { EngagementTrendChart } from "@/components/engagement/engagement-trend-chart";
import { SegmentBreakdownChart } from "@/components/engagement/segment-breakdown-chart";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { engagementHistory, userSegments } from "@/data/productpulse";

export const metadata: Metadata = { title: "Engagement" };

export default function EngagementPage() {
  const latest = engagementHistory[engagementHistory.length - 1];
  const first = engagementHistory[0];

  const stickiness = (latest.dau / latest.mau) * 100;
  const stickinessStart = (first.dau / first.mau) * 100;
  const stickinessDelta = stickiness - stickinessStart;

  const weekOf = new Date(`${latest.date}T00:00:00Z`).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" },
  );

  const atRiskOrDormant = userSegments
    .filter((s) => s.segment === "At Risk" || s.segment === "Dormant")
    .reduce((sum, s) => sum + s.pctOfBase, 0);

  return (
    <>
      <PageHeader
        eyebrow="Engagement & Usage"
        title="Who keeps coming back, and how often"
        description="Daily, weekly, and monthly active usage, the stickiness ratio behind it, and how the user base breaks down from Power users to Dormant."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="DAU"
          value={latest.dau.toLocaleString("en-US")}
          hint={`Week of ${weekOf}`}
          definition="Daily Active Users — unique users who took a meaningful action on a given day."
        />
        <StatCard
          label="WAU"
          value={latest.wau.toLocaleString("en-US")}
          hint={`Week of ${weekOf}`}
          definition="Weekly Active Users — unique users active in the last 7 days."
        />
        <StatCard
          label="MAU"
          value={latest.mau.toLocaleString("en-US")}
          hint={`Week of ${weekOf}`}
          definition="Monthly Active Users — unique users active in the last 30 days."
        />
        <StatCard
          label="Stickiness (DAU ÷ MAU)"
          value={`${stickiness.toFixed(1)}%`}
          hint={`${stickinessDelta >= 0 ? "+" : ""}${stickinessDelta.toFixed(1)} pts since January`}
          definition="The share of monthly active users who show up on a given day — a measure of how habitual the product is."
          className="border-gold/35"
          valueClassName="text-gold-gradient"
        />
      </div>

      <section className="mb-6 rounded-xl border border-border bg-card px-5 py-4">
        <h2 className="font-heading text-base font-semibold tracking-tight">
          Active users
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Weekly snapshots, January–June 2026.
        </p>
        <div className="mt-4">
          <EngagementTrendChart history={engagementHistory} />
        </div>
        <p className="sr-only">
          DAU grew from {first.dau.toLocaleString("en-US")} to{" "}
          {latest.dau.toLocaleString("en-US")}, WAU from{" "}
          {first.wau.toLocaleString("en-US")} to{" "}
          {latest.wau.toLocaleString("en-US")}, and MAU from{" "}
          {first.mau.toLocaleString("en-US")} to{" "}
          {latest.mau.toLocaleString("en-US")} between January and June 2026.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card px-5 py-4">
        <h2 className="font-heading text-base font-semibold tracking-tight">
          User segments
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Current monthly active base of {latest.mau.toLocaleString("en-US")} users —{" "}
          {atRiskOrDormant.toFixed(0)}% are At Risk or Dormant.
        </p>
        <div className="mt-4">
          <SegmentBreakdownChart segments={userSegments} />
        </div>
        <ul className="sr-only">
          {userSegments.map((s) => (
            <li key={s.segment}>
              {s.segment}: {s.userCount.toLocaleString("en-US")} users (
              {s.pctOfBase}% of base)
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
