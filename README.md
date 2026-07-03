# ProductPulse

**Executive product-analytics dashboard that traces shipped initiatives to the metric movement they actually caused.** A read-only, synthetic-data demo from [Fischer Product Lab](https://github.com/Fischer-Product-Lab).

Live: [productpulse-fpl.vercel.app](https://productpulse-fpl.vercel.app)

Most growth dashboards answer *what happened*. ProductPulse also answers *what did we ship that caused it, and did it work?* — via an **Initiative Registry** that connects every shipped initiative (AI and standard alike) to its before→after adoption movement and a deterministically computed impact status.

## How it pairs with AgentOps

[AgentOps](https://agentops-fpl.vercel.app/) asks *"is this AI initiative safe to launch?"* before it ships. ProductPulse asks *"did it actually work?"* after it ships. Same suite, same rigor — governance before, accountability after.

## Screens

| Route | Screen | Job |
|---|---|---|
| `/` | Executive Brief | North Star metric, headline KPIs, needs-attention list |
| `/adoption` | Adoption & Activation | Signup→Activated→Habitual funnel; adoption by initiative |
| `/engagement` | Engagement & Usage | DAU/WAU/MAU trend, stickiness, user segments |
| `/retention` | Retention & Churn Risk *(V1.1)* | Cohort retention curves, churn-risk segmentation |
| `/revenue` | Revenue & Business Impact | MRR trend, expansion/contraction, NRR, AI cost savings |
| `/initiatives` | **Initiative Registry** | Every shipped initiative, before→after movement, computed status |
| `/about` | About | Product context, architecture, security posture, metric glossary |

## The impact engine

The centerpiece is a pure function, [`src/lib/impact.ts`](src/lib/impact.ts), that rates every initiative **Strong Impact**, **Monitor**, or **Underperforming** from stored numbers:

- Adoption lift ≥ 25 pts **and** a measurable business outcome (>5 hrs/month saved or >$1,000 revenue impact) → **Strong Impact**
- Adoption lift < 5 pts → **Underperforming**
- Anything between → **Monitor**

No AI calls, no scoring drift: same inputs, same status, always. The UI only ever displays what this function returns — statuses are never hardcoded. A [vitest suite](src/lib/impact.test.ts) asserts the status of every seeded initiative plus dataset consistency (MRR movement math, segment coverage).

V1.1 added a second engine in the same mold: [`src/lib/churn-risk.ts`](src/lib/churn-risk.ts) rates each user segment **Low**, **Elevated**, or **High** churn risk from stored usage signals (session frequency, recency, seat utilization), with its own [test suite](src/lib/churn-risk.test.ts) and cross-checks tying cohort sizes to the adoption funnel and segment MRR to the revenue history.

## Stack

- Next.js (App Router) · TypeScript strict mode · Tailwind CSS · shadcn/ui · Recharts
- No backend, no database — a fully typed synthetic dataset in [`src/data/productpulse.ts`](src/data/productpulse.ts)
- Every route statically prerendered; deployed on Vercel from GitHub `main`
- Fonts: Fraunces (headings) and Hanken Grotesk (body) via `next/font`

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # vitest — impact engine + dataset consistency
npm run lint
npm run build
```

No environment variables required.

## Security posture

Read-only by design: no forms, no write paths, no auth, no uploads, no cookies, no secrets. All data is synthetic and labeled as such in the UI. See [SECURITY.md](SECURITY.md) and the [STRIDE threat model](docs/threat-model.md).

## Fischer Product Lab

One thesis: turn noisy, high-stakes reality into governed, decision-quality executive signal.

- [AgentOps](https://agentops-fpl.vercel.app/) — AI agent governance control tower
- [TrustDesk](https://trustdesk-fpl.vercel.app/) — customer trust automation
- [VulnBoard](https://vuln-board.vercel.app/) — executive vulnerability metrics
- **ProductPulse** — product performance accountability (this repo)

---

*All figures in this application are synthetic demo data. No real product, customer, or revenue data is represented.*
