# ProductPulse — Threat Model

**Scope:** the deployed ProductPulse demo (productpulse-fpl.vercel.app) and this repository.
**Last reviewed:** July 2026.

## System characterization

ProductPulse is a statically prerendered Next.js application with **no backend, no database, no authentication, and no write paths**. All content is compiled from a typed, hand-authored synthetic dataset (`src/data/productpulse.ts`) at build time. The initiative impact status is computed by a deterministic pure function (`src/lib/impact.ts`) — no model calls, no external scoring.

### Assets

| Asset | Value |
|---|---|
| Site integrity (what visitors see) | Primary — the demo is a portfolio artifact |
| Build & deploy pipeline (GitHub `main` → Vercel) | Primary — the only write path that exists |
| Synthetic dataset | Low — fictional by design, public in the repo |
| Visitor trust (no tracking, no data collection) | Primary |

### Trust boundaries

1. **GitHub repository → Vercel build** — the only path that changes the site.
2. **Vercel CDN → visitor browser** — static asset delivery over TLS.

There is no boundary between "user" and "system" at runtime: every visitor sees the same static content, and the application accepts no input.

## STRIDE analysis

| Threat | Applies? | Analysis & mitigation |
|---|---|---|
| **S**poofing | Build pipeline only | No user identities exist to spoof at runtime. Spoofing risk concentrates on repo/deploy credentials: GitHub account with 2FA, Vercel deploys only from `main`. A visitor-facing spoof (lookalike domain) is mitigated by linking the canonical URL from the GitHub org and sibling products. |
| **T**ampering | Build pipeline only | No runtime write paths — nothing a visitor can tamper with. Content tampering requires compromising the repo or Vercel project; mitigated by protected `main`-only deploys, reviewed commits, and lockfile-pinned dependencies (`package-lock.json`). |
| **R**epudiation | No | There are no user actions to repudiate. Deploy history is auditable in GitHub commit history and Vercel deployment logs. |
| **I**nformation disclosure | No | All data is synthetic and intentionally public. No secrets, keys, or env vars ship to the browser (`NEXT_PUBLIC_` variables are prohibited by project policy). No cookies or storage are set, so nothing can leak. |
| **D**enial of service | Low | Static assets on Vercel's CDN; no compute-per-request to exhaust. Availability loss is a portfolio inconvenience, not a data or safety risk. |
| **E**levation of privilege | No | No privilege levels exist at runtime — there is nothing to elevate to. |

## Residual risks

1. **Dependency supply chain** — a malicious transitive dependency could inject content at build time. Mitigations: lockfile, minimal dependency surface, no postinstall scripts beyond the framework's own.
2. **Deploy credential compromise** — the dominant risk, as with any static site. Mitigations: 2FA on GitHub and Vercel, single deploy branch.
3. **Content misrepresentation** — a visitor mistaking synthetic data for real metrics. Mitigated in-product: a persistent "Synthetic demo data" badge in the top bar and disclaimers in the sidebar, About page, and README.

## Non-goals

This model intentionally excludes threats that require the very features the product refuses to have (account takeover, injection into a data store, stored XSS from user content, CSRF). Keeping V1 read-only is the mitigation.
