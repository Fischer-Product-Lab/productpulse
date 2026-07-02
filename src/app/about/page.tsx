import type { Metadata } from "next";

import { ComingInNextStep, PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About this demo"
        title="What ProductPulse is, and how it's built"
        description="Product context, architecture, and security posture for this read-only demo — plus where it sits in the Fischer Product Lab suite."
      />
      <ComingInNextStep
        items={[
          "Product context and the AgentOps relationship",
          "Architecture summary and security posture",
          "Links to AgentOps, TrustDesk, and VulnBoard",
          "What's coming next (retention & cohort view)",
        ]}
      />
    </>
  );
}
