import Link from "next/link";

import { ProductWindow } from "./product-window";

const STEPS = [
  {
    n: "01",
    label: "Record",
    copy: "Every shipped initiative — AI and standard — is logged with the metric it was meant to move, and the baseline at launch.",
  },
  {
    n: "02",
    label: "Measure",
    copy: "Adoption before and after come from the same stored series. The chart and the headline numbers cannot disagree.",
  },
  {
    n: "03",
    label: "Score",
    copy: "A pure function rates the movement. Lift of 25 points plus a real outcome is Strong Impact. Lift under 5 is Underperforming.",
  },
  {
    n: "04",
    label: "Decide",
    copy: "Same inputs, same status, always. No model in the loop. The verdict is explainable because it is arithmetic.",
  },
];

export function LandingPage() {
  return (
    <div className="marketing">
      <div className="marketing-grain" aria-hidden />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-baseline gap-3">
            <span className="marketing-type-body font-medium tracking-tight text-ivory">
              ProductPulse
            </span>
            <span className="marketing-type-meta text-mk-gold">
              Fischer Product Lab
            </span>
          </Link>
          <Link
            href="/demo"
            className="marketing-type-meta text-ivory/70 transition-colors hover:text-mk-gold"
          >
            Open the demo
          </Link>
        </header>

        <main className="flex flex-1 flex-col">
          <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-8 pt-10 text-center sm:pt-16">
            <p className="marketing-type-meta marketing-rise text-mk-gold">
              Portfolio demonstration · read-only · synthetic data
            </p>
            <h1 className="marketing-type-display marketing-rise marketing-rise-delay-1 mt-6 max-w-5xl text-ivory">
              Did the launched
              <br />
              product actually work?
            </h1>
            <p className="marketing-type-body marketing-rise marketing-rise-delay-2 mx-auto mt-6 max-w-xl text-ivory/70">
              Adoption, engagement, retention, revenue, and every shipped
              initiative — one decision-ready view. The status is computed,
              never asserted.
            </p>
            <div className="marketing-rise marketing-rise-delay-3 mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="marketing-type-body inline-flex h-11 items-center rounded-sm bg-ivory px-6 font-medium text-navy transition-opacity hover:opacity-90"
              >
                Open the demo
              </Link>
              <a
                href="#how-it-decides"
                className="marketing-type-body inline-flex h-11 items-center rounded-sm border border-mk-gold/45 px-6 font-medium text-ivory transition-colors hover:border-mk-gold hover:text-mk-gold"
              >
                See how it decides
              </a>
            </div>
          </section>

          <section
            className="marketing-rise marketing-rise-delay-4 relative mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6"
            aria-label="ProductPulse product"
          >
            <div className="marketing-light" aria-hidden />
            <Link
              href="/demo"
              className="relative z-10 block rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mk-gold"
            >
              <span className="sr-only">
                Open the executive brief in the live demo
              </span>
              <ProductWindow />
            </Link>
          </section>

          <section
            id="how-it-decides"
            className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pb-24"
          >
            <p className="marketing-type-meta text-mk-gold">How it decides</p>
            <h2 className="marketing-type-title mt-3 max-w-2xl text-ivory">
              Impact is a pure function. Same numbers, same verdict. No model
              in the loop.
            </h2>
            <ol className="mt-12 divide-y divide-hairline border-y border-hairline">
              {STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid gap-3 py-7 sm:grid-cols-[5rem_10rem_1fr] sm:items-baseline sm:gap-8"
                >
                  <span className="font-mono text-[length:var(--type-body)] tabular-nums text-mk-gold">
                    {step.n}
                  </span>
                  <span className="marketing-type-meta text-ivory">
                    {step.label}
                  </span>
                  <p className="marketing-type-body text-ivory/70">
                    {step.copy}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </main>

        <footer className="mx-auto w-full max-w-6xl border-t border-hairline px-6 py-8">
          <p className="marketing-type-meta text-ivory/45">
            Fischer Product Lab · portfolio demonstration · © Trevor Fischer
          </p>
        </footer>
      </div>
    </div>
  );
}
