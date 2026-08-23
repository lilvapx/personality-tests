<script lang="ts">
	import { resultStore } from '$lib/stores/results.svelte';
	import { resetSession } from '$lib/stores/testSession.svelte';
	import ResultChart from '$lib/components/ResultChart.svelte';
	import FacetBreakdown from '$lib/components/FacetBreakdown.svelte';
	import DisclaimerBanner from '$lib/components/DisclaimerBanner.svelte';
	import { downloadResultJson, downloadResultCsv, downloadResultAsJson } from '$lib/export/downloadResult';

	function restart() {
		resetSession();
	}

	function exportJson() {
		if (resultStore.result) {
			downloadResultJson(resultStore.result);
		}
	}

	function exportCsv() {
		if (resultStore.result) {
			downloadResultCsv(resultStore.result);
		}
	}

	function exportSimpleJson() {
		if (resultStore.result) {
			downloadResultAsJson(resultStore.result, resultStore.result.instrument_id);
		}
	}
</script>

<svelte:head>
	<title>Auswertung — personality-tests</title>
</svelte:head>

{#if resultStore.result}
	<h1>Dein Ergebnis</h1>
	<p class="meta">
		{resultStore.result.instrument_id} · {resultStore.result.locale} · {new Date(resultStore.result.completed_at).toLocaleString()}
	</p>

	<DisclaimerBanner message="Interpretiere die Werte mit Vorsicht — dies ist kein klinisches Instrument." />

	<h2>Domains</h2>
	<ResultChart domains={resultStore.result.domains} max={5} />

	<h2>Facetten</h2>
	<FacetBreakdown domains={resultStore.result.domains} max={5} />

	<div class="actions">
		<a href="/" class="btn" onclick={restart}>Zur Übersicht</a>
		<a href="/methodology" class="btn secondary">So wird ausgewertet</a>
		<button class="btn secondary" onclick={exportJson}>JSON exportieren</button>
		<button class="btn secondary" onclick={exportCsv}>CSV exportieren</button>
	</div>
{:else}
	<h1>Kein Ergebnis</h1>
	<p>Du hast noch keinen Test abgeschlossen.</p>
	<a href="/" class="btn">Zur Übersicht</a>
{/if}

<style>
	.meta { color: #888; font-size: 0.85rem; }
	h2 { margin-top: 2rem; }
	.actions { display: flex; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap; }
	.btn {
		padding: 0.75rem 1.5rem;
		background: #4a90d9; color: #fff;
		border-radius: 8px; text-decoration: none; font-weight: 600;
		border: none;
		cursor: pointer;
	}
	.btn:hover { background: #3a7bc0; }
	.btn.secondary { background: #eee; color: #333; }
	.btn.secondary:hover { background: #ddd; }
</style>
