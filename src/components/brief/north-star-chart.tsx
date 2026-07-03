"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { EngagementSnapshot } from "@/data/productpulse";

function formatTick(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function NorthStarChart({
  history,
}: {
  history: EngagementSnapshot[];
}) {
  return (
    <div className="h-64 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={history}
          margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="northStarGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatTick}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            minTickGap={48}
          />
          <YAxis
            tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : `${v}`)}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={44}
            domain={["dataMin - 200", "dataMax + 200"]}
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
            labelFormatter={(label) => formatTick(String(label))}
            formatter={(value) => Number(value).toLocaleString("en-US")}
          />
          <Area
            dataKey="wau"
            name="Weekly Active Users"
            type="monotone"
            stroke="var(--gold)"
            strokeWidth={2.5}
            fill="url(#northStarGold)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
