import { ComingInNextStep, PageHeader } from "@/components/layout/page-header";

export default function BriefPage() {
  return (
    <>
      <PageHeader
        eyebrow="Executive Brief"
        title="The state of the product, in one screen"
        description="The North Star metric, headline KPIs, and anything that needs an executive's attention this cycle — before the meeting starts."
      />
      <ComingInNextStep
        items={[
          "North Star metric trend (Weekly Active Teams)",
          "KPI tiles: activation rate, stickiness, NRR, AI hours saved",
          "Needs-attention list of initiatives rated Monitor or Underperforming",
        ]}
      />
    </>
  );
}
