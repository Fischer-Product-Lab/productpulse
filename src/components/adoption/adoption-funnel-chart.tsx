"use client";

import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import type { AdoptionFunnelStage } from "@/data/productpulse";

export function AdoptionFunnelChart({
  stages,
}: {
  stages: AdoptionFunnelStage[];
}) {
  const max = Math.max(...stages.map((s) => s.count));

  return (
    <div className="h-56 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={stages}
          layout="vertical"
          margin={{ top: 4, right: 72, bottom: 4, left: 8 }}
          barCategoryGap="28%"
        >
          <defs>
            <linearGradient id="funnelGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--gold)" />
              <stop offset="100%" stopColor="var(--gold-light)" />
            </linearGradient>
          </defs>
          <XAxis type="number" domain={[0, max]} hide />
          <YAxis
            type="category"
            dataKey="stage"
            axisLine={false}
            tickLine={false}
            width={92}
            tick={{ fill: "var(--muted-foreground)", fontSize: 13 }}
          />
          <Bar
            dataKey="count"
            fill="url(#funnelGold)"
            radius={[4, 4, 4, 4]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="count"
              position="right"
              formatter={(value: React.ReactNode) =>
                Number(value).toLocaleString("en-US")
              }
              style={{
                fill: "var(--foreground)",
                fontSize: 13,
                fontFamily: "var(--font-geist-mono)",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
