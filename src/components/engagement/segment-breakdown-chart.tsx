"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import type { UserSegmentBreakdown } from "@/data/productpulse";

const segmentColors: Record<UserSegmentBreakdown["segment"], string> = {
  Power: "var(--chart-3)",
  Core: "var(--chart-1)",
  Casual: "var(--chart-2)",
  "At Risk": "var(--chart-5)",
  Dormant: "var(--chart-4)",
};

export function SegmentBreakdownChart({
  segments,
}: {
  segments: UserSegmentBreakdown[];
}) {
  const data = segments.map((s) => ({
    ...s,
    label: `${s.userCount.toLocaleString("en-US")} · ${s.pctOfBase}%`,
  }));
  const max = Math.max(...segments.map((s) => s.userCount));

  return (
    <div className="h-64 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 96, bottom: 4, left: 8 }}
          barCategoryGap="24%"
        >
          <XAxis type="number" domain={[0, Math.ceil(max * 1.15)]} hide />
          <YAxis
            type="category"
            dataKey="segment"
            axisLine={false}
            tickLine={false}
            width={72}
            tick={{ fill: "var(--muted-foreground)", fontSize: 13 }}
          />
          <Bar dataKey="userCount" radius={[4, 4, 4, 4]} isAnimationActive={false}>
            {data.map((s) => (
              <Cell key={s.segment} fill={segmentColors[s.segment]} />
            ))}
            <LabelList
              dataKey="label"
              position="right"
              style={{
                fill: "var(--foreground)",
                fontSize: 12,
                fontFamily: "var(--font-geist-mono)",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
