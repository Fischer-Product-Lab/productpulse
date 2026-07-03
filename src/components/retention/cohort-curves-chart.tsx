"use client";

import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CohortRetention } from "@/data/productpulse";

function cohortLabel(cohort: string) {
  return new Date(`${cohort}-01T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
}

/** Older cohorts fade, newer cohorts brighten — same gold, rising emphasis. */
const opacityRamp = [0.3, 0.42, 0.55, 0.7, 0.85, 1];

export function CohortCurvesChart({
  cohorts,
}: {
  cohorts: CohortRetention[];
}) {
  const maxMonths = Math.max(...cohorts.map((c) => c.retentionPct.length));
  const data = Array.from({ length: maxMonths }, (_, m) => {
    const row: Record<string, number | string> = { month: `M${m}` };
    for (const c of cohorts) {
      if (m < c.retentionPct.length) {
        row[cohortLabel(c.cohort)] = c.retentionPct[m];
      }
    }
    return row;
  });

  return (
    <div className="h-72 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
        >
          <XAxis
            dataKey="month"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={44}
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
            labelFormatter={(label) => `${label} — months since activation`}
            formatter={(value) => `${value}%`}
          />
          <Legend
            iconType="plainline"
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value: string) => (
              <span style={{ color: "var(--muted-foreground)" }}>{value}</span>
            )}
          />
          {cohorts.map((c, i) => (
            <Line
              key={c.cohort}
              dataKey={cohortLabel(c.cohort)}
              type="monotone"
              stroke="var(--gold)"
              strokeOpacity={opacityRamp[i] ?? 1}
              strokeWidth={i === cohorts.length - 2 ? 2.5 : 1.75}
              dot={{ r: 2.5, fill: "var(--gold)", fillOpacity: opacityRamp[i] ?? 1, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
