import type { Metadata } from "next";

import { ComingInNextStep, PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Adoption" };

export default function AdoptionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Adoption & Activation"
        title="From signup to habit"
        description="How new accounts move through the Signed Up → Activated → Habitual funnel, and how quickly shipped initiatives are being picked up."
      />
      <ComingInNextStep
        items={[
          "Signed Up → Activated → Habitual funnel",
          "Adoption rate by initiative, filterable by AI vs. Standard",
        ]}
      />
    </>
  );
}
