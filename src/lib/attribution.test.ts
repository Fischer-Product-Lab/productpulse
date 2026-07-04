import { describe, expect, it } from "vitest";

import { initiatives } from "@/data/productpulse";
import { findConfoundingLaunches } from "@/lib/attribution";

const byId = (id: string) => {
  const initiative = initiatives.find((i) => i.id === id);
  if (!initiative) throw new Error(`missing ${id}`);
  return initiative;
};

describe("findConfoundingLaunches", () => {
  it("never reports an initiative as confounding itself", () => {
    for (const initiative of initiatives) {
      const ids = findConfoundingLaunches(initiative, initiatives).map(
        (c) => c.initiative.id,
      );
      expect(ids).not.toContain(initiative.id);
    }
  });

  it("finds the nearby launches for the exec brief generator", () => {
    const result = findConfoundingLaunches(byId("ini-008"), initiatives);
    expect(result.map((c) => c.initiative.id)).toEqual(["ini-004", "ini-007"]);
    expect(result.map((c) => c.deltaDays)).toEqual([-35, -42]);
  });

  it("finds the pricing migration next to the onboarding redesign", () => {
    const result = findConfoundingLaunches(byId("ini-002"), initiatives);
    expect(result.map((c) => c.initiative.id)).toEqual(["ini-005"]);
    expect(result[0].deltaDays).toBe(27);
  });

  it("includes launches exactly on the 42-day boundary", () => {
    const ids = findConfoundingLaunches(byId("ini-001"), initiatives).map(
      (c) => c.initiative.id,
    );
    expect(ids).toContain("ini-007"); // +42 days
    expect(ids).toContain("ini-005"); // -42 days
    expect(ids).not.toContain("ini-004"); // +49 days
  });

  it("sorts nearest launch first", () => {
    const deltas = findConfoundingLaunches(byId("ini-001"), initiatives).map(
      (c) => Math.abs(c.deltaDays),
    );
    expect(deltas).toEqual([...deltas].sort((a, b) => a - b));
  });
});

describe("adoption evidence series consistency", () => {
  for (const initiative of initiatives) {
    it(`${initiative.id} series agrees with its headline numbers`, () => {
      const s = initiative.adoptionSeries;
      expect(s.length).toBeGreaterThan(4);
      // Anchored to the headline before/after figures.
      expect(s[0].adoptionPct).toBe(initiative.adoptionPctBefore);
      expect(s[s.length - 1].adoptionPct).toBe(initiative.adoptionPctAfter);
      // Covers pre-launch baseline and the launch itself.
      expect(s[0].weeksSinceLaunch).toBe(-8);
      expect(s.some((p) => p.weeksSinceLaunch === 0)).toBe(true);
      // Strictly increasing time axis.
      for (let n = 1; n < s.length; n++) {
        expect(s[n].weeksSinceLaunch).toBeGreaterThan(s[n - 1].weeksSinceLaunch);
      }
      // Pre-launch samples hug the baseline (±1 pt noise).
      for (const p of s.filter((p) => p.weeksSinceLaunch <= 0)) {
        expect(Math.abs(p.adoptionPct - initiative.adoptionPctBefore)).toBeLessThanOrEqual(1);
      }
    });
  }

  it("maps initiatives to their real AgentOps registry counterparts", () => {
    // These ids exist in the AgentOps demo registry
    // (agentops-fpl.vercel.app/registry/{id}) — the chips deep-link to
    // them, so a wrong id here is a broken link in production.
    const expectedReviewIds: Record<string, string | undefined> = {
      "ini-001": "agt-001", // Jira Triage Bot (Launch)
      "ini-003": "agt-002", // Release Notes Drafter (Launch)
      "ini-004": "agt-003", // Support Ticket Summarizer (Conditional)
      // ini-008 has no counterpart agent; Standard initiatives are
      // outside AgentOps governance entirely.
    };
    for (const initiative of initiatives) {
      expect(initiative.agentOpsReviewId).toBe(expectedReviewIds[initiative.id]);
    }
  });
});
