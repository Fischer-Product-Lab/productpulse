import type { Metadata } from "next";

import { ComingInNextStep, PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Engagement" };

export default function EngagementPage() {
  return (
    <>
      <PageHeader
        eyebrow="Engagement & Usage"
        title="Who keeps coming back, and how often"
        description="Daily, weekly, and monthly active usage, the stickiness ratio behind it, and how the user base breaks down from Power users to Dormant."
      />
      <ComingInNextStep
        items={[
          "DAU / WAU / MAU trend",
          "Stickiness ratio (DAU/MAU) callout",
          "User-segment breakdown: Power, Core, Casual, At Risk, Dormant",
        ]}
      />
    </>
  );
}
