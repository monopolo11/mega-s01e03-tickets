<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { groupByProblem, PROBLEM_TICKET, TICKETS_REPO } from '#lib/kb/problems';

  // One row per problem in a merged ticket, each linked to its own ticket.
  let { ticket }: { ticket: number } = $props();

  const rows = reports as Report[];
  const merged = $derived(uniqueById(rows).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByProblem(merged, tenantOf, notes.oneDayMove));
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} (from {rows.length} exported rows, counted once per id) ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>intake tagged otherwise</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      {@const own = PROBLEM_TICKET[g.problem]}
      <tr>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td>{g.mistagged}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if own}<a href="{TICKETS_REPO}/issues/{own}">#{own}</a>{:else}none yet{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
</style>
