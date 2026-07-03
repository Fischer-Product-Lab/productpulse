"use client";

import {
  Bar,
  BarChart,
  Legend,
  ReferenceLine,
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

export function MrrMovementChart({ history }: { history: RevenueSnapshot[] }) {
  const data = history.map((s) => ({
    date: s.date,
    New: s.newMrr,
    Expansion: s.expansionMrr,
    Contraction: -s.contractionMrr,
    Churned: -s.churnedMrr,
  }));

  return (
    <div className="h-72 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
          stackOffset="sign"
          barCategoryGap="28%"
        >
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
          />
          <Tooltip
            cursor={{ fill: "rgba(245, 239, 225, 0.04)" }}
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
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value: string) => (
              <span style={{ color: "var(--muted-foreground)" }}>{value}</span>
            )}
          />
          <ReferenceLine y={0} stroke="var(--border)" />
          <Bar dataKey="New" stackId="mrr" fill="var(--chart-2)" isAnimationActive={false} />
          <Bar dataKey="Expansion" stackId="mrr" fill="var(--success)" isAnimationActive={false} />
          <Bar dataKey="Contraction" stackId="mrr" fill="var(--warning)" isAnimationActive={false} />
          <Bar
            dataKey="Churned"
            stackId="mrr"
            fill="var(--danger)"
            radius={[0, 0, 4, 4]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
