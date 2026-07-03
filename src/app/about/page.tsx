import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "About" };

const siblings = [
  {
    name: "AgentOps",
    tagline: "AI agent governance control tower — decides if an initiative is safe to launch.",
    href: "https://agentops-fpl.vercel.app/",
  },
  {
    name: "TrustDesk",
    tagline: "Customer trust automation — security questionnaires with a deterministic confidence engine.",
    href: "https://trustdesk-fpl.vercel.app/",
  },
  {
    name: "VulnBoard",
    tagline: "Executive vulnerability metrics — exposure as decision-quality signal.",
    href: "https://vuln-board.vercel.app/",
  },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card px-5 py-4">
      <h2 className="font-heading text-base font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About this demo"
        title="What ProductPulse is, and how it's built"
        description="A read-only executive product-analytics demo built on synthetic data — every number on every screen is fictional, and every status is computed, never asserted."
      />

      <div className="space-y-6">
        <Section title="Product context">
          <p>
            ProductPulse is an executive product-analytics dashboard for a
            fictional B2B SaaS product. It tracks adoption, engagement, and
            revenue — and, critically, maintains an initiative registry that
            connects specific shipped work (AI features and standard product
            work alike) to the metric movement that followed. Most growth
            dashboards answer <em className="text-foreground">what happened</em>;
            ProductPulse also answers{" "}
            <em className="text-foreground">
              what did we ship that caused it, and did it work?
            </em>
          </p>
          <div className="rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-foreground">
            <p>
              ProductPulse is the natural second half of AgentOps: AgentOps asks{" "}
              <em>&ldquo;is this AI initiative safe to launch?&rdquo;</em>{" "}
              before it ships. ProductPulse asks{" "}
              <em>&ldquo;did it actually work?&rdquo;</em> after. Governance
              before, accountability after.
            </p>
          </div>
        </Section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Architecture">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Next.js App Router with TypeScript strict mode; every route is
                statically prerendered.
              </li>
              <li>
                No backend, no database, no APIs — a fully typed synthetic
                dataset lives in <code className="text-foreground">src/data/</code>.
              </li>
              <li>
                Impact statuses come from a deterministic pure function in{" "}
                <code className="text-foreground">src/lib/impact.ts</code>,
                covered by a vitest suite. Same inputs, same status, always —
                no AI calls, no scoring drift.
              </li>
              <li>
                Tailwind CSS with shadcn/ui components and Recharts, deployed
                on Vercel from GitHub <code className="text-foreground">main</code>.
              </li>
            </ul>
          </Section>

          <Section title="Security posture">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Read-only by design: no forms, no write paths, no
                authentication, no uploads, no cookies.
              </li>
              <li>All data is synthetic and labeled as such in the UI.</li>
              <li>
                No secrets, no API keys, no environment variables exposed to
                the browser.
              </li>
              <li>
                A STRIDE threat model and security policy ship with the repo —
                see{" "}
                <a
                  href="https://github.com/Fischer-Product-Lab/productpulse/blob/main/docs/threat-model.md"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold transition-colors hover:text-gold-light"
                >
                  docs/threat-model.md
                </a>{" "}
                and{" "}
                <a
                  href="https://github.com/Fischer-Product-Lab/productpulse/blob/main/SECURITY.md"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold transition-colors hover:text-gold-light"
                >
                  SECURITY.md
                </a>
                .
              </li>
            </ul>
          </Section>
        </div>

        <Section title="Fischer Product Lab">
          <p>
            One suite, one thesis: turn noisy, high-stakes reality into
            governed, decision-quality executive signal.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {siblings.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-lg border border-border bg-background/40 px-4 py-3 transition-colors hover:border-gold/40"
              >
                <span className="flex items-center gap-1.5 font-heading text-sm font-semibold text-foreground">
                  {s.name}
                  <ExternalLink
                    aria-hidden
                    className="size-3 text-muted-foreground transition-colors group-hover:text-gold"
                  />
                </span>
                <span className="mt-1 block text-xs leading-relaxed">
                  {s.tagline}
                </span>
              </a>
            ))}
          </div>
          <p>
            Source for this demo:{" "}
            <a
              href="https://github.com/Fischer-Product-Lab/productpulse"
              target="_blank"
              rel="noreferrer"
              className="text-gold transition-colors hover:text-gold-light"
            >
              github.com/Fischer-Product-Lab/productpulse
            </a>
          </p>
        </Section>

        <Section title="Coming next">
          <p>
            V1.1 adds a retention view: cohort retention curves and churn-risk
            segmentation, built on the same synthetic dataset and the same
            deterministic rules.
          </p>
        </Section>
      </div>
    </>
  );
}
