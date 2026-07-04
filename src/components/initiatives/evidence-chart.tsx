"use client";

import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AdoptionSample } from "@/data/productpulse";

function weekLabel(w: number) {
  return w === 0 ? "Launch" : w > 0 ? `W+${w}` : `W${w}`;
}

function sampleDate(launchDate: string, weeks: number) {
  const d = new Date(Date.parse(`${launchDate}T00:00:00Z`) + weeks * 7 * 86400000);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function EvidenceChart({
  series,
  launchDate,
}: {
  series: AdoptionSample[];
  launchDate: string;
}) {
  const maxPct = Math.max(...series.map((p) => p.adoptionPct));
  const gradientId = `evidence-${launchDate}`;

  return (
    <div className="h-44 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={series}
          margin={{ top: 14, right: 12, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="weeksSinceLaunch"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(w: number) => weekLabel(w)}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, Math.min(100, maxPct + 10)]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid rgba(245, 239, 225, 0.12)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--muted-foreground)", marginBottom: 2 }}
            itemStyle={{ color: "var(--foreground)" }}
            labelFormatter={(w) =>
              `${weekLabel(Number(w))} · ${sampleDate(launchDate, Number(w))}`
            }
            formatter={(value) => [`${value}%`, "Adoption"]}
          />
          <ReferenceLine
            x={0}
            stroke="var(--foreground)"
            strokeOpacity={0.35}
            strokeDasharray="4 3"
            label={{
              value: "Launch",
              position: "top",
              fill: "var(--muted-foreground)",
              fontSize: 10,
            }}
          />
          <Area
            dataKey="adoptionPct"
            name="Adoption"
            type="monotone"
            stroke="var(--gold)"
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
