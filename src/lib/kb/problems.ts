// The problems a merged ticket really holds. causes.ts tells `parser` from `hint` by tenant. The
// desk's one-day moves (desk-notes.json) are neither: no day/month swap, the date moves by one day.
// They get a problem of their own here instead of being counted under `parser`.
import { causeOf, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'one-day move' | 'unplaced';

// Each problem's own ticket, in the repo that split #4471.
export const TICKETS_REPO = 'https://github.com/monopolo11/mega-s01e03-tickets';
export const PROBLEM_TICKET: Partial<Record<Problem, number>> = { parser: 1, hint: 2, 'one-day move': 3 };

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem {
  if (oneDayMove.includes(r.id)) return 'one-day move';
  return causeOf(r, t) ?? 'unplaced';
}

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: number;
  // Reports intake tagged as something else than this problem.
  mistagged: number;
  firstSeen: string;
  lastSeen: string;
};

export function groupByProblem(
  reports: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): ProblemGroup[] {
  const byProblem = new Map<Problem, Report[]>();
  for (const r of reports) {
    const p = problemOf(r, tenantOf(r), oneDayMove);
    byProblem.set(p, [...(byProblem.get(p) ?? []), r]);
  }
  return [...byProblem.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        tenants: new Set(rs.map((r) => r.tenant)).size,
        mistagged: rs.filter((r) => r.meta.intakeTag !== problem).length,
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
}
