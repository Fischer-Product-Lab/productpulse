"use client";

import type { SegmentRiskSignal } from "@/data/productpulse";
import type { ChurnRiskResult } from "@/lib/churn-risk";
import { RiskTierBadge } from "@/components/risk-tier-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ChurnRiskTable({
  rows,
}: {
  rows: { signal: SegmentRiskSignal; risk: ChurnRiskResult; userCount: number }[];
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-5">Segment</TableHead>
            <TableHead className="text-right">Users</TableHead>
            <TableHead className="text-right">MRR</TableHead>
            <TableHead className="text-right">Sessions / wk</TableHead>
            <TableHead className="text-right">Last active</TableHead>
            <TableHead className="text-right">Seat util.</TableHead>
            <TableHead className="pr-5">Churn risk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ signal, risk, userCount }) => (
            <TableRow key={signal.segment}>
              <TableCell className="pl-5 font-medium">{signal.segment}</TableCell>
              <TableCell className="text-right font-mono text-sm text-muted-foreground">
                {userCount.toLocaleString("en-US")}
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {usd.format(signal.mrrUsd)}
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {signal.avgSessionsPerWeek.toFixed(1)}
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {signal.medianDaysSinceLastActive}d ago
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {signal.seatUtilizationPct}%
              </TableCell>
              <TableCell className="pr-5">
                <TooltipProvider delay={150}>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <span
                          tabIndex={0}
                          className="cursor-help rounded-full focus-visible:outline-2 focus-visible:outline-ring"
                        />
                      }
                    >
                      <RiskTierBadge tier={risk.tier} />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-72 text-pretty">
                      <ul className="list-disc space-y-0.5 pl-3.5">
                        {risk.reasons.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
