"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import type { Initiative } from "@/data/productpulse";
import type { ImpactResult } from "@/lib/impact";
import { ImpactStatusBadge } from "@/components/impact-status-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatLaunchDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function signed(value: number, suffix: string) {
  return `${value > 0 ? "+" : ""}${value}${suffix}`;
}

function TypeBadge({ type }: { type: Initiative["type"] }) {
  return type === "AI" ? (
    <Badge variant="outline" className="border-gold/40 bg-gold/10 text-gold-light">
      AI
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      Standard
    </Badge>
  );
}

function AdoptionBar({ before, after }: { before: number; after: number }) {
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-muted-foreground">Adoption</span>
        <span className="font-mono text-foreground">
          {before}% <span aria-hidden>→</span> {after}%
        </span>
      </div>
      <div
        className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`Adoption moved from ${before}% before launch to ${after}% now`}
      >
        <div className="bg-foreground/25" style={{ width: `${before}%` }} />
        <div
          className="bg-gradient-to-r from-gold to-gold-light"
          style={{ width: `${Math.max(after - before, 0)}%` }}
        />
      </div>
    </div>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-mono text-sm text-foreground">{value}</dd>
    </div>
  );
}

export function InitiativeCard({
  initiative,
  impact,
}: {
  initiative: Initiative;
  impact: ImpactResult;
}) {
  const [open, setOpen] = React.useState(false);
  const detailsId = `${initiative.id}-details`;

  return (
    <article className="rounded-xl border border-border bg-card transition-colors hover:border-foreground/20">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={detailsId}
        className="w-full rounded-xl px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-ring"
      >
        <div className="grid items-center gap-x-6 gap-y-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-base font-semibold tracking-tight md:text-lg">
                {initiative.name}
              </h2>
              <TypeBadge type={initiative.type} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {initiative.owner} · launched {formatLaunchDate(initiative.launchDate)}
            </p>
          </div>

          <AdoptionBar
            before={initiative.adoptionPctBefore}
            after={initiative.adoptionPctAfter}
          />

          <div className="flex items-center gap-3 md:justify-end">
            <ImpactStatusBadge status={impact.status} />
            <ChevronDown
              aria-hidden
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {initiative.narrative}
        </p>
      </button>

      {open && (
        <div id={detailsId} className="border-t border-border px-5 py-4">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-gold">
                Why this status
              </h3>
              <ul className="mt-2 space-y-1.5">
                {impact.reasons.map((reason) => (
                  <li
                    key={reason}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold/60"
                    />
                    {reason}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted-foreground">
                {initiative.description}
              </p>
            </div>

            <dl className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 md:grid-cols-2">
              <DetailMetric
                label="Adoption lift"
                value={signed(impact.adoptionLiftPts, " pts")}
              />
              <DetailMetric
                label="Engagement lift"
                value={signed(initiative.engagementLiftPct, "%")}
              />
              {initiative.hoursSavedPerMonth !== undefined && (
                <DetailMetric
                  label="Hours saved / mo"
                  value={String(initiative.hoursSavedPerMonth)}
                />
              )}
              {initiative.costSavedPerMonthUsd !== undefined && (
                <DetailMetric
                  label="Cost saved / mo"
                  value={usd.format(initiative.costSavedPerMonthUsd)}
                />
              )}
              {initiative.revenueImpactUsd !== undefined && (
                <DetailMetric
                  label="Revenue impact"
                  value={usd.format(initiative.revenueImpactUsd)}
                />
              )}
            </dl>
          </div>
        </div>
      )}
    </article>
  );
}
