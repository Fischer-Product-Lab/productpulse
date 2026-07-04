import type { Initiative } from "@/data/productpulse";

/**
 * Two launches closer together than this share an observation window,
 * so adoption movement can't be cleanly attributed to either alone.
 */
export const CONFOUND_WINDOW_DAYS = 42;

export interface ConfoundingLaunch {
  initiative: Initiative;
  /** Days between launches; positive = launched after the target. */
  deltaDays: number;
}

const dayMs = 24 * 60 * 60 * 1000;

/**
 * Deterministic attribution caveat — same contract as the other
 * engines: stored inputs, stated threshold, same output always. Returns
 * every other initiative launched within the window, nearest first.
 */
export function findConfoundingLaunches(
  target: Initiative,
  all: Initiative[],
  windowDays: number = CONFOUND_WINDOW_DAYS,
): ConfoundingLaunch[] {
  const targetLaunch = Date.parse(`${target.launchDate}T00:00:00Z`);

  return all
    .filter((i) => i.id !== target.id)
    .map((initiative) => ({
      initiative,
      deltaDays: Math.round(
        (Date.parse(`${initiative.launchDate}T00:00:00Z`) - targetLaunch) / dayMs,
      ),
    }))
    .filter(({ deltaDays }) => Math.abs(deltaDays) <= windowDays)
    .sort((a, b) => Math.abs(a.deltaDays) - Math.abs(b.deltaDays));
}
