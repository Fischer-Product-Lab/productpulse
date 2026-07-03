import type { CohortRetention } from "@/data/productpulse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function cohortLabel(cohort: string) {
  return new Date(`${cohort}-01T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function CohortTable({ cohorts }: { cohorts: CohortRetention[] }) {
  const maxMonths = Math.max(...cohorts.map((c) => c.retentionPct.length));

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-5">Cohort</TableHead>
            <TableHead className="text-right">Activated</TableHead>
            {Array.from({ length: maxMonths }, (_, m) => (
              <TableHead key={m} className="text-right last:pr-5">
                M{m}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {cohorts.map((c) => (
            <TableRow key={c.cohort}>
              <TableCell className="pl-5 font-medium">
                {cohortLabel(c.cohort)}
              </TableCell>
              <TableCell className="text-right font-mono text-sm text-muted-foreground">
                {c.activatedUsers.toLocaleString("en-US")}
              </TableCell>
              {Array.from({ length: maxMonths }, (_, m) => {
                const pct = c.retentionPct[m];
                return (
                  <TableCell key={m} className="p-0 last:pr-0">
                    {pct !== undefined ? (
                      <span
                        className="block px-4 py-2.5 text-right font-mono text-sm"
                        style={{
                          backgroundColor: `color-mix(in srgb, var(--gold) ${Math.round(pct * 0.3)}%, transparent)`,
                        }}
                      >
                        {pct}%
                      </span>
                    ) : (
                      <span
                        aria-hidden
                        className="block px-4 py-2.5 text-right text-sm text-muted-foreground/40"
                      >
                        —
                      </span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
