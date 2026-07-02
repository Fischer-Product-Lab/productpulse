"use client";

import * as React from "react";

import type { Initiative, InitiativeType } from "@/data/productpulse";
import type { ImpactResult } from "@/lib/impact";
import { ImpactStatusBadge } from "@/components/impact-status-badge";
import { InitiativeTypeBadge } from "@/components/initiative-type-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TypeFilter = "All" | InitiativeType;

const filters: TypeFilter[] = ["All", "AI", "Standard"];

export function InitiativeAdoptionTable({
  rows,
}: {
  rows: { initiative: Initiative; impact: ImpactResult }[];
}) {
  const [filter, setFilter] = React.useState<TypeFilter>("All");

  const visible = rows.filter(
    ({ initiative }) => filter === "All" || initiative.type === filter,
  );

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight">
            Adoption by initiative
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Share of the relevant workflow using each initiative, baseline vs. today.
          </p>
        </div>
        <div
          role="group"
          aria-label="Filter by initiative type"
          className="inline-flex rounded-lg border border-border p-0.5"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Initiative</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Baseline</TableHead>
              <TableHead className="text-right">Current</TableHead>
              <TableHead className="text-right">Lift</TableHead>
              <TableHead className="pr-5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map(({ initiative, impact }) => (
              <TableRow key={initiative.id}>
                <TableCell className="pl-5">
                  <span className="font-medium">{initiative.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {initiative.owner}
                  </span>
                </TableCell>
                <TableCell>
                  <InitiativeTypeBadge type={initiative.type} />
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground">
                  {initiative.adoptionPctBefore}%
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {initiative.adoptionPctAfter}%
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono text-sm",
                    impact.adoptionLiftPts >= 25
                      ? "text-success"
                      : impact.adoptionLiftPts < 5
                        ? "text-danger"
                        : "text-foreground",
                  )}
                >
                  {impact.adoptionLiftPts > 0 ? "+" : ""}
                  {impact.adoptionLiftPts} pts
                </TableCell>
                <TableCell className="pr-5">
                  <ImpactStatusBadge status={impact.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
