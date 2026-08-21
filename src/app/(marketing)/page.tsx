import type { Metadata } from "next";

import { LandingPage } from "@/components/marketing/landing-page";

export const metadata: Metadata = {
  title: "ProductPulse — Did the launched thing actually work?",
  description:
    "See adoption, engagement, retention, revenue, and shipped initiatives from one decision-ready view. A read-only Fischer Product Lab demonstration with synthetic data.",
};

export default function MarketingPage() {
  return <LandingPage />;
}
