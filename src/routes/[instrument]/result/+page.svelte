<script lang="ts">
	import { currentResult } from '$lib/stores/results.svelte';
	import { resetSession } from '$lib/stores/testSession.svelte';
	import ResultChart from '$lib/components/ResultChart.svelte';
	import FacetBreakdown from '$lib/components/FacetBreakdown.svelte';
	import DisclaimerBanner from '$lib/components/DisclaimerBanner.svelte';

	function restart() {
		resetSession();
	}
</script>

<svelte:head>
	<title>Auswertung — personality-tests</title>
</svelte:head>

{#if currentResult}
	<h1>Dein Ergebnis</h1>
	<p class="meta">
		{currentResult.instrument_id} · {currentResult.locale} · {new Date(currentResult.completed_at).toLocaleString()}
	</p>

	<DisclaimerBanner message="Interpretiere die Werte mit Vorsicht — dies ist kein klinisches Instrument." />

	<h2>Domains</h2>
	<ResultChart domains={currentResult.domains} max={5} />

	<h2>Facetten</h2>
	<FacetBreakdown domains={currentResult.domains} max={5} />

	<div class="actions">
		<a href="/" class="btn" onclick={restart}>Zur Übersicht</a>
		<a href="/methodology" class="btn secondary">So wird ausgewertet</a>
	</div>
{:else}
	<h1>Kein Ergebnis</h1>
	<p>Du hast noch keinen Test abgeschlossen.</p>
	<a href="/" class="btn">Zur Übersicht</a>
{/if}

<style>
	.meta { color: #888; font-size: 0.85rem; }
	h2 { margin-top: 2rem; }
	.actions { display: flex; gap: 1rem; margin-top: 2.5rem; }
	.btn {
		padding: 0.75rem 1.5rem;
		background: #4a90d9; color: #fff;
		border-radius: 8px; text-decoration: none; font-weight: 600;
	}
	.btn:hover { background: #3a7bc0; }
	.btn.secondary { background: #eee; color: #333; }
	.btn.secondary:hover { background: #ddd; }
</style>
