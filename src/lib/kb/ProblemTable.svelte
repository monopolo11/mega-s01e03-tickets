<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { PROBLEM_TICKET, ticketUrl } from '#lib/kb/problems';

  // One row per cause in a merged ticket, each linked to its own ticket. One-day moves are counted
  // where they're filed, like the desk's CauseTable, and get a footnote row with their ticket.
  let { ticket }: { ticket: number } = $props();

  const rows = reports as Report[];
  const merged = $derived(uniqueById(rows).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const moves = $derived(merged.filter((r) => notes.oneDayMove.includes(r.id)).length);
  const mistagged = (g: { cause: string; taggedAs: Record<string, number> }) =>
    Object.entries(g.taggedAs).reduce((n, [tag, k]) => (tag === g.cause ? n : n + k), 0);
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} (from {rows.length} exported rows, counted once per id) ·
  <strong>{groups.length + (moves ? 1 : 0)}</strong> problems
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>intake tagged otherwise</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      {@const moved = readAs(g, notes.oneDayMove)}
      <tr>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td>{mistagged(g)}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if g.cause === 'unplaced'}none yet{:else}<a href={ticketUrl(g.cause)}>#{PROBLEM_TICKET[g.cause]}</a>{/if}</td>
      </tr>
      {#if moved}
        <tr class="moved">
          <td><code>one-day move</code></td>
          <td>{moved}</td>
          <td colspan="3">read as a one-day move; counted above under <code>{g.cause}</code>, where filed</td>
          <td><a href={ticketUrl('one-day move')}>#{PROBLEM_TICKET['one-day move']}</a></td>
        </tr>
      {/if}
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .moved td { color: var(--muted); font-size: 0.9em; }
</style>
