"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RevenueSnapshot } from "@/data/productpulse";

function formatMonth(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
}

function formatUsd(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function MrrTrendChart({ history }: { history: RevenueSnapshot[] }) {
  return (
    <div className="h-64 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={history}
          margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="mrrGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatMonth}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={52}
            domain={["dataMin - 20000", "dataMax + 10000"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid rgba(245, 239, 225, 0.12)",
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: "var(--muted-foreground)", marginBottom: 4 }}
            itemStyle={{ color: "var(--foreground)" }}
            labelFormatter={(label) =>
              new Date(`${String(label)}T00:00:00Z`).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })
            }
            formatter={(value) => formatUsd(Number(value))}
          />
          <Area
            dataKey="mrr"
            name="MRR"
            type="monotone"
            stroke="var(--gold)"
            strokeWidth={2.5}
            fill="url(#mrrGold)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
