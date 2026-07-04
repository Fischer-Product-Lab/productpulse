# ProductPulse — Project Context

A working record of what was built, the decisions behind it, and the conventions that keep it consistent. Written for anyone (human or AI assistant) picking this project up cold. Companion to [PRODUCTPULSE_BUILD_KIT.md](PRODUCTPULSE_BUILD_KIT.md) (the original spec) and [CLAUDE.md](../CLAUDE.md) (working rules).

**Live:** [productpulse-fpl.vercel.app](https://productpulse-fpl.vercel.app) · **Repo:** [github.com/Fischer-Product-Lab/productpulse](https://github.com/Fischer-Product-Lab/productpulse) · **Built:** July 2–3, 2026

---

## 1. What this is

ProductPulse is a read-only, synthetic-data executive product-analytics dashboard — the fourth Fischer Product Lab portfolio product (after AgentOps, TrustDesk, VulnBoard). Its differentiator is the **Initiative Registry**: every shipped initiative (AI and standard) is traced to before→after metric movement, with an impact status computed by a deterministic pure function, never asserted. The interview framing: AgentOps decides whether an AI initiative is safe to launch; ProductPulse shows whether it worked.

## 2. Build timeline

| Step | What shipped |
|---|---|
| Prompt A | Next.js scaffold, brand system, app shell (sidebar, top bar, synthetic-data badge, mobile sheet) |
| — | GitHub repo created (`Fischer-Product-Lab/productpulse`, lowercase to match `trustdesk`/`agentops`) |
| Prompt B | Typed dataset (`src/data/productpulse.ts`), `computeImpact` engine, vitest suite |
| Prompt C | `/initiatives` registry — expandable cards, computed status badges, adoption bars |
| Prompt D | `/adoption` — funnel chart, conversion tiles, AI/Standard-filterable table |
| Prompt E | `/engagement` — DAU/WAU/MAU trend, stickiness callout, segment breakdown |
| Prompt F | `/revenue` — MRR area chart, diverging movement bars, NRR callout, AI-savings rollup |
| Prompt G | `/` Executive Brief — North Star (WAU), KPI tiles linking to detail screens, needs-attention list |
| Prompt H | `/about`, README, SECURITY.md, docs/threat-model.md (STRIDE) |
| Prompt I | User deployed via Vercel dashboard as `productpulse-fpl`; no env vars |
| Post-V1 | Metric-definition tooltips on stat cards (user-requested) |
| V1.1 | `/retention` — cohort curves, retention triangle, churn-risk engine — plus a 15-term glossary on `/about` (user-requested) |

All work is committed to `main`; every push auto-deploys to Vercel.

## 3. Stack and structure

- **Next.js 16** (App Router, Turbopack build), **TypeScript strict**, **Tailwind v4** (CSS-first `@theme` in `globals.css` — no `tailwind.config`), **shadcn/ui on Base UI primitives** (not Radix), **Recharts v3**, **vitest**.
- No backend, no database, no env vars. All routes statically prerendered.
- `src/data/` — typed synthetic data (`productpulse.ts`) and canonical metric definitions (`glossary.ts`).
- `src/lib/` — the two deterministic engines (`impact.ts`, `churn-risk.ts`) and their tests.
- `src/components/` — `layout/` (shell), `ui/` (shadcn), per-screen folders (`initiatives/`, `adoption/`, `engagement/`, `revenue/`, `brief/`, `retention/`), and shared leaves (`stat-card.tsx`, `impact-status-badge.tsx`, `initiative-type-badge.tsx`, `risk-tier-badge.tsx`).

### Brand system (in `src/app/globals.css`)
Single fixed dark theme, no light mode: background `#0b0f17`, ivory `#f5efe1`, gold `#c9a45c` → `#f0d18a`. Fraunces headings (applied to h1–h6 via base layer), Hanken Grotesk body, Geist Mono for figures. Status colors `--success`/`--warning`/`--danger`; five-color chart palette `--chart-1..5`; `text-gold-gradient` utility.

## 4. The two deterministic engines

Both follow the same contract: pure function, stored inputs, stated thresholds, `reasons[]` explaining the verdict. The UI only displays what they return.

1. **`computeImpact`** (`src/lib/impact.ts`, verbatim from build kit §6): Strong Impact (lift ≥25 pts + measurable outcome), Underperforming (lift <5), Monitor (between). Statuses across the 8 seeded initiatives: 4 / 2 / 2.
2. **`computeChurnRisk`** (`src/lib/churn-risk.ts`, added in V1.1): High (inactive ≥30 days, or <0.5 sessions/wk while inactive ≥14 days), Elevated (<2 sessions/wk, inactive ≥7 days, or seat utilization <30%), Low otherwise. Tiers across segments: Power/Core Low, Casual Elevated, At Risk/Dormant High.

## 5. Key decisions and why

- **ini-006 seeded as 22→26, not the kit's 22→27.** The kit's table promised Underperforming, but a lift of exactly 5 rates Monitor under the `lift < 5` rule — an off-by-one at the boundary. The function is the source of truth and stays verbatim; the data point moved instead. User approved. Documented in comments in the data file and test.
- **North Star = Weekly Active Users**, not the kit's example "Weekly Active Teams" — the dataset models users, not teams. Adding a teams series later is a small data change if the framing is ever wanted.
- **NRR convention:** monthly, existing-base — `(priorMRR + expansion − contraction − churn) ÷ priorMRR` = 101.6% for June. The brief reuses the identical formula so screens can never disagree; the tile's hint states the formula.
- **Funnel drawn as horizontal bars,** not Recharts `FunnelChart` — trapezoid funnels read poorly at dashboard size and obscure exact values.
- **MRR movement chart includes New MRR** alongside the kit's expansion/contraction/churn so bars reconcile to the MRR trend (`stackOffset="sign"` diverging stack around a zero line).
- **Brief KPI tiles compute with the same code paths/formulas as their detail screens** and link to them.
- **Tooltips (post-V1):** `StatCard` takes `definition?`; the label becomes a Base UI tooltip trigger rendered as a focusable `<span>` — the default `<button>` would be invalid HTML inside the brief's `<Link>`-wrapped tiles. Registry cards expose `computeImpact` reasons on click; churn-risk badges expose rule hits on hover.
- **Glossary as single source (V1.1):** `src/data/glossary.ts` exports `METRIC_DEFS` (used by every stat-card tooltip) and a 15-term `glossary` array rendered on `/about` — definitions can't drift, and touch users (no hover) get a readable fallback.
- **Retention cohorts are activation cohorts** ("of users who activated in month X, % still active N months later"), letting the three newest cohorts sum exactly to the funnel's trailing-90-day Activated count.

## 6. Synthetic-data consistency rules (enforced by tests)

23 vitest tests across `impact.test.ts` and `churn-risk.test.ts`:

- Each of the 8 initiatives resolves to its intended status; each segment to its intended risk tier; both engines deterministic.
- Each month's MRR = prior MRR + new + expansion − contraction − churned.
- User segments sum to 100% of base (and to the latest MAU: 9,640).
- Cohort curves start at 100 and never increase; each cohort has exactly the months observable through June 2026.
- Newest 3 cohort sizes sum to funnel Activated (7,940); segment MRR attribution sums to month-end MRR ($509,900).

Headline figures, if you need them without opening the app: MRR $509,900 · NRR 101.6% · activation 64.0% · stickiness 22.2% · WAU 5,230 (+31.4% since Jan) · AI savings 94 h ≈ $8,930/mo at the stated `BLENDED_HOURLY_RATE_USD = 95` · M1 retention 58% (Jan cohort) → 75% (May) · $45,900 MRR in high-risk segments.

## 7. Workflow and conventions

- `npm test && npm run lint && npm run build` before every commit — all three are green on `main`.
- Browser-verify every screen (desktop ~1366px and 375px mobile) before committing; charts and interactions checked in the DOM, not just screenshots.
- The repo owner sometimes edits files directly on GitHub — **`git pull --rebase` before pushing**.
- Windows dev machine: CRLF warnings on commit are normal and harmless. `create-next-app` can't run in the repo dir (capital letters in "ProductPulse" break npm naming) — scaffold in a lowercase subdir and move up if ever re-scaffolding.

## 8. Gotchas discovered (so nobody rediscovers them)

- **Recharts `LabelList` formatter** must be typed `(value: React.ReactNode)` — `(value: number)` fails `next build` typecheck.
- **Recharts label clipping:** give the hidden numeric axis headroom (`domain={[0, max * 1.15]}`) so right-positioned labels on the longest bar don't clip/wrap.
- **Base UI tooltips in automated tests:** they don't open via programmatic `.focus()` or partial event dispatch — send the full `pointerover/pointerenter/pointermove` + mouse equivalents with `pointerType: "mouse"`. Synthetic `pointerleave` won't close them either.
- **React re-renders in browser eval checks:** reading the DOM synchronously after `.click()` sees the pre-render state — await ~100ms.
- **shadcn CLI** (2026 versions): flags changed (`-b` is base library, presets prompt interactively); `-d` gives defaults on **Base UI**, and generated components (e.g. `SheetTrigger`, `TooltipTrigger`) use a `render` prop instead of Radix's `asChild`.

## 9. Where to take it next (nothing committed)

Ideas consistent with the suite thesis, in rough order of value: per-initiative drill-down (metric time series around launch date), a teams-based North Star series, initiative filtering on the registry itself, linking adoption-table rows to their expanded registry cards. The pattern for any addition: typed data in `src/data/`, a deterministic rule in `src/lib/` with tests, explainability surfaced in the UI.

---

*All figures are synthetic demo data. This file records process and decisions; the spec remains PRODUCTPULSE_BUILD_KIT.md.*
