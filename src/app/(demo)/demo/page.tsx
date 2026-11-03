import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  ChartNoAxesCombined,
  CircleCheck,
  ScanEye,
} from "lucide-react";

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
import { summarizeInitiatives } from "@/lib/initiative-summary";

export default function BriefPage() {
  const latest = engagementHistory[engagementHistory.length - 1];
  const first = engagementHistory[0];
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
  const aiInitiatives = initiatives.filter((i) => i.type === "AI");
  const aiHoursSaved = aiInitiatives.reduce(
    (sum, i) => sum + (i.hoursSavedPerMonth ?? 0),
    0,
  );
  const wauGrowthPct = ((latest.wau - first.wau) / first.wau) * 100;
  const { counts, needsAttention, total } = summarizeInitiatives(initiatives);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-0">
        <PageHeader
          eyebrow="Product performance"
          title="Executive brief"
          description="See the movement. Find the exceptions. Follow the evidence behind what shipped."
        />
        <Link
          href="/initiatives"
          className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-gold/30 bg-gold/5 px-4 text-sm font-medium text-gold-light transition-colors hover:border-gold/60 hover:bg-gold/10"
        >
          Explore initiatives <ArrowUpRight aria-hidden className="size-4" />
        </Link>
      </div>

      <div className="mb-5 grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
        <section
          aria-labelledby="north-star-title"
          className="brief-north-star min-w-0 rounded-2xl border border-gold/25 bg-card px-5 pb-4 pt-5 sm:px-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                <ChartNoAxesCombined aria-hidden className="size-4" /> North
                Star
              </p>
              <h2 id="north-star-title" className="mt-3 text-lg font-medium">
                Weekly Active Users
              </h2>
              <p className="mt-1 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                {latest.wau.toLocaleString("en-US")}
              </p>
            </div>
            <div className="rounded-lg border border-success/20 bg-success/5 px-3 py-2 text-right">
              <p className="font-mono text-sm text-success">
                +{wauGrowthPct.toFixed(1)}%
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                since January
              </p>
            </div>
          </div>
          <div className="mt-4">
            <NorthStarChart
              history={engagementHistory}
              className="h-48 sm:h-52"
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
            <p>January–June 2026 · weekly observations</p>
            <Link
              href="/engagement"
              className="inline-flex min-h-9 items-center gap-1.5 text-gold-light hover:underline"
            >
              Explore engagement{" "}
              <ArrowUpRight aria-hidden className="size-3.5" />
            </Link>
          </div>
          <p className="sr-only">
            Weekly Active Users grew from {first.wau.toLocaleString("en-US")} in
            January 2026 to {latest.wau.toLocaleString("en-US")} in June 2026.
          </p>
        </section>

        <section
          aria-labelledby="cycle-title"
          className="flex flex-col rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            The portfolio readout
          </p>
          <h2
            id="cycle-title"
            className="mt-3 text-2xl font-semibold leading-tight"
          >
            {counts["Strong Impact"]} of {total} initiatives show strong impact.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The remaining {needsAttention.length} need a closer look. Start with
            the smallest adoption gains, then review the evidence.
          </p>
          <dl className="my-5 space-y-3 text-sm">
            <div className="flex items-center gap-2.5">
              <CircleCheck aria-hidden className="size-4 text-success" />
              <dt className="text-muted-foreground">Strong Impact</dt>
              <dd className="ml-auto font-mono text-foreground">
                {counts["Strong Impact"]}
              </dd>
            </div>
            <div className="flex items-center gap-2.5">
              <ScanEye aria-hidden className="size-4 text-warning" />
              <dt className="text-muted-foreground">Monitor</dt>
              <dd className="ml-auto font-mono text-foreground">
                {counts.Monitor}
              </dd>
            </div>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex size-4 items-center justify-center text-danger"
              >
                !
              </span>
              <dt className="text-muted-foreground">Underperforming</dt>
              <dd className="ml-auto font-mono text-foreground">
                {counts.Underperforming}
              </dd>
            </div>
          </dl>
          <a
            href="#needs-attention"
            className="mt-auto flex min-h-11 items-center justify-between gap-3 rounded-lg bg-gradient-to-br from-gold to-gold-light px-4 text-sm font-semibold text-primary-foreground hover:brightness-110"
          >
            Review {needsAttention.length} initiatives{" "}
            <ArrowDown aria-hidden className="size-4" />
          </a>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            Computed from stored figures. Shared launch windows can limit
            attribution.
          </p>
        </section>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Activation rate"
          value={`${activationRate.toFixed(1)}%`}
          hint="Signed Up → Activated · trailing 90 days"
          definition={METRIC_DEFS.activationRate}
          href="/adoption"
          linkLabel="View adoption"
        />
        <StatCard
          label="Stickiness"
          value={`${stickiness.toFixed(1)}%`}
          hint="DAU ÷ MAU, latest week"
          definition={METRIC_DEFS.stickiness}
          href="/engagement"
          linkLabel="View engagement"
        />
        <StatCard
          label="Net revenue retention"
          value={`${nrr.toFixed(1)}%`}
          hint="June, existing-base retention"
          definition={METRIC_DEFS.nrr}
          href="/revenue"
          linkLabel="View revenue"
        />
        <StatCard
          label="AI hours saved / mo"
          value={`${aiHoursSaved} h`}
          hint={`Across ${aiInitiatives.length} shipped AI initiatives`}
          definition={METRIC_DEFS.aiCostSavings}
          href="/revenue"
          linkLabel="View cost savings"
        />
      </div>

      <section
        id="needs-attention"
        aria-labelledby="attention-title"
        className="scroll-mt-36 overflow-hidden rounded-2xl border border-border bg-card lg:scroll-mt-24"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-5 sm:px-6">
          <div>
            <h2
              id="attention-title"
              className="flex items-center gap-2.5 text-xl font-semibold tracking-tight"
            >
              Needs attention{" "}
              <span className="rounded-md bg-warning/10 px-2 py-0.5 font-sans text-xs font-medium text-warning">
                {needsAttention.length}
              </span>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Underperforming first, then Monitor. Open an initiative to inspect
              the reasons.
            </p>
          </div>
          <Link
            href="/initiatives"
            className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-gold-light hover:underline"
          >
            Full registry <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
        <NeedsAttentionList items={needsAttention} />
      </section>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Synthetic demo data · Read-only workspace · Every status is computed by
        the same deterministic impact engine.
      </p>
    </>
  );
}
