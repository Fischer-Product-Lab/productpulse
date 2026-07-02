import type { Metadata } from "next";

import { ComingInNextStep, PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Revenue" };

export default function RevenuePage() {
  return (
    <>
      <PageHeader
        eyebrow="Revenue & Business Impact"
        title="What the product earns, and what it saves"
        description="MRR trajectory, the expansion and contraction underneath it, net revenue retention, and the cost savings attributable to AI initiatives."
      />
      <ComingInNextStep
        items={[
          "MRR trend",
          "Expansion / contraction / churn breakdown",
          "Net revenue retention, displayed prominently",
          "AI cost-savings rollup across AI initiatives",
        ]}
      />
    </>
  );
}
