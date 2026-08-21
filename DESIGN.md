# ProductPulse — visual language

Portfolio surface for Fischer Product Lab. This is a cinematic, read-only demonstration — not a night SaaS, not a title-card overlay on the existing dashboard.

## Tokens

| Token | Hex | Role |
| --- | --- | --- |
| Navy | `#0B1220` | Void. Landing canvas. |
| Ivory | `#F4EFE4` | Type and the primary CTA fill. |
| Gold | `#C4A35A` | The only accent. Rules, meta, rim-light, secondary CTA. |

Atmosphere is one thing: **film grain + a single gold/ivory light** sitting over a real ProductPulse product window. Status colors (Strong Impact / Monitor / Underperforming) exist only inside the product chrome, where they mean something.

The live demo keeps its own tokens (`#0b0f17` / `#f5efe1` / `#c9a45c`) so the product chrome stays itself.

## Type

Landing face: **Geist**. Mono: **Geist Mono**. Loaded via `next/font`. The live demo screens keep Hanken Grotesk + Fraunces.

Four sizes on the landing, no more:

| Name | Use |
| --- | --- |
| Display | Hero headline only |
| Title | Section heads |
| Body | Subcopy and how-it-works |
| Meta | Eyebrows, nav, footer — mono, tracked, uppercase |

## Product question

See adoption, engagement, retention, revenue, and shipped initiatives from one decision-ready view — did the launched thing actually work?

## Kill list

- No purple. No indigo mesh. No default shadcn violet.
- No Inter as the face.
- No emoji icons.
- No Spline / R3F orb.
- No fake “trusted by” logos.
- No five CTAs. Two: **Open the demo** and **See how it decides**.
- No auth, Stripe, CMS, or a second product.
- Do not invent metrics. The product window reads WAU, activation, and initiative-to-metric movement from the existing synthetic dataset and `computeImpact`.
- Do not drop a title-card overlay on the existing dashboard.
- Do not copy TrustDesk copy, chrome, or questionnaire language. Steal the register only: void, one light, grain, grotesque headline, real product under the light.
