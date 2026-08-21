import { ImpactStatusBadge } from "@/components/impact-status-badge";
import { InitiativeTypeBadge } from "@/components/initiative-type-badge";
import { NorthStarChart } from "@/components/brief/north-star-chart";
import {
  adoptionFunnel,
  engagementHistory,
  initiatives,
} from "@/data/productpulse";
import { computeImpact } from "@/lib/impact";

const FEATURED_IDS = ["ini-001", "ini-005", "ini-007"] as const;

const WINDOW_NAV = [
  "Brief",
  "Adoption",
  "Engagement",
  "Retention",
  "Revenue",
  "Initiatives",
] as const;

/**
 * Faithful in-page chrome of the executive brief — real WAU, real
 * activation, real initiative-to-metric movement from computeImpact.
 * Not a generic dashboard and not a title-card overlay.
 */
export function ProductWindow() {
  const latest = engagementHistory[engagementHistory.length - 1];
  const first = engagementHistory[0];
  const [signedUp, activated] = adoptionFunnel;
  const activationRate = (activated.count / signedUp.count) * 100;
  const wauGrowthPct = ((latest.wau - first.wau) / first.wau) * 100;

  const featured = FEATURED_IDS.map((id) => {
    const initiative = initiatives.find((item) => item.id === id);
    if (!initiative) return null;
    return { initiative, impact: computeImpact(initiative) };
  }).filter((row) => row !== null);

  return (
    <div className="product-window overflow-hidden rounded-xl bg-background text-foreground">
      <div className="flex items-center gap-3 border-b border-border bg-card px-3 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </div>
        <div className="mx-auto flex h-7 max-w-md flex-1 items-center justify-center rounded-md border border-border bg-background px-3 font-mono text-[11px] tracking-normal text-muted-foreground">
          productpulse · demo
        </div>
      </div>

      <div className="flex min-h-[28rem] bg-background">
        <aside className="hidden w-44 shrink-0 border-r border-sidebar-border bg-sidebar p-3 sm:block">
          <div className="flex items-center gap-2 px-1 py-1">
            <span className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-gold to-gold-light font-heading text-sm font-semibold text-primary-foreground">
              P
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-heading text-sm font-semibold text-foreground">
                ProductPulse
              </span>
              <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                FPL
              </span>
            </span>
          </div>
          <div className="mt-4 px-1 text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Product
          </div>
          <ul className="mt-2 space-y-0.5 text-[12px]">
            {WINDOW_NAV.map((label, i) => (
              <li
                key={label}
                className={`relative rounded-md px-2.5 py-1.5 ${
                  i === 0 ? "bg-sidebar-accent text-sidebar-foreground" : "text-muted-foreground"
                }`}
              >
                {i === 0 && (
                  <span className="absolute top-1/2 left-0 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-gold" />
                )}
                {label}
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 space-y-3 p-4 sm:p-5">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gold">
                Executive Brief
              </p>
              <h3 className="mt-1 font-heading text-lg font-semibold tracking-tight">
                Weekly Active Users
              </h3>
            </div>
            <p className="font-heading text-2xl font-semibold tracking-tight">
              {latest.wau.toLocaleString("en-US")}
              <span className="ml-2 align-middle font-sans text-xs font-normal text-success">
                +{wauGrowthPct.toFixed(1)}% since January
              </span>
            </p>
          </header>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Activation rate
              </p>
              <p className="mt-1.5 font-heading text-xl font-semibold tracking-tight">
                {activationRate.toFixed(1)}%
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Signed Up → Activated
              </p>
            </div>
            <div className="rounded-xl border border-gold/25 bg-card px-4 py-3 sm:col-span-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-gold">
                North Star
              </p>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                WAU from the same series as the engagement screen.
              </p>
              <NorthStarChart history={engagementHistory} className="mt-1 h-28" />
            </div>
          </div>

          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h4 className="font-heading text-sm font-semibold tracking-tight">
                Initiative to metric
              </h4>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Before → after adoption. Status from computeImpact — never hardcoded.
              </p>
            </div>
            <ul className="divide-y divide-border">
              {featured.map(({ initiative, impact }) => (
                <li
                  key={initiative.id}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-medium">
                        {initiative.name}
                      </span>
                      <InitiativeTypeBadge type={initiative.type} />
                    </div>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {initiative.adoptionPctBefore}% → {initiative.adoptionPctAfter}%
                      <span className="ml-2">
                        {impact.adoptionLiftPts > 0 ? "+" : ""}
                        {impact.adoptionLiftPts} pts
                      </span>
                    </p>
                  </div>
                  <ImpactStatusBadge status={impact.status} className="shrink-0" />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
