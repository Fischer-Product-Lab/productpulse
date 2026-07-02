import type { Metadata } from "next";

import { ComingInNextStep, PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Initiatives" };

export default function InitiativesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Initiative Registry"
        title="What we shipped — and whether it worked"
        description="Every shipped initiative, AI and standard alike, traced to the metric movement that followed. Impact status is computed deterministically from the numbers, never asserted."
      />
      <ComingInNextStep
        items={[
          "Registry of all shipped initiatives with AI / Standard badges",
          "Before → after adoption movement per initiative",
          "Computed impact status: Strong Impact, Monitor, Underperforming",
          "The reasoning behind each status, on demand",
        ]}
      />
    </>
  );
}
