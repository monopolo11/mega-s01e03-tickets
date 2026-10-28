// The problems #4471 really holds, and the ticket each one got. Counting stays the desk's own
// (causes.ts): `parser` and `hint` by tenant. The desk's one-day moves (desk-notes.json) are a third
// problem, but like every desk view they are counted where they're filed and footnoted there.
import type { Cause } from '#lib/kb/causes';

export type Problem = Cause | 'one-day move';

// Each problem's own ticket, in the repo that split #4471.
export const TICKETS_REPO = 'https://github.com/monopolo11/mega-s01e03-tickets';
export const PROBLEM_TICKET: Record<Problem, number> = { parser: 1, hint: 2, 'one-day move': 3 };

export const ticketUrl = (p: Problem) => `${TICKETS_REPO}/issues/${PROBLEM_TICKET[p]}`;
