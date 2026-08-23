<script lang="ts">
	import { resultStore } from '$lib/stores/results.svelte';
	import { resetSession } from '$lib/stores/testSession.svelte';
	import ResultChart from '$lib/components/ResultChart.svelte';
	import FacetBreakdown from '$lib/components/FacetBreakdown.svelte';
	import DisclaimerBanner from '$lib/components/DisclaimerBanner.svelte';
	import { downloadResultJson, downloadResultCsv, downloadResultAsJson } from '$lib/export/downloadResult';
	import { t } from '$lib/i18n/ui';

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
	<title>{t('result.title')}</title>
</svelte:head>

{#if resultStore.result}
	<h1>{t('result.heading')}</h1>
	<p class="meta">
		{resultStore.result.instrument_id} · {resultStore.result.locale} · {new Date(resultStore.result.completed_at).toLocaleString()}
	</p>

	<DisclaimerBanner message={t('result.disclaimer')} />

	<h2>{t('result.domains')}</h2>
	<ResultChart domains={resultStore.result.domains} max={5} />

	<h2>{t('result.facets')}</h2>
	<FacetBreakdown domains={resultStore.result.domains} max={5} />

	<div class="actions">
		<a href="/" class="btn" onclick={restart}>{t('result.overview')}</a>
		<a href="/methodology" class="btn secondary">{t('result.methodology')}</a>
		<button class="btn secondary" onclick={exportJson}>{t('result.exportJson')}</button>
		<button class="btn secondary" onclick={exportCsv}>{t('result.exportCsv')}</button>
	</div>
{:else}
	<h1>{t('result.none')}</h1>
	<p>{t('result.noneText')}</p>
	<a href="/" class="btn">{t('result.overview')}</a>
{/if}

<style>
	.meta { color: #888; font-size: 0.85rem; }
	h2 { margin-top: 2rem; }
	.actions { display: flex; gap: 0.75rem; margin-top: 2.5rem; flex-wrap: wrap; }
	.btn {
		padding: 0.75rem 1.25rem;
		background: #4a90d9; color: #fff;
		border-radius: 8px; text-decoration: none; font-weight: 600;
		border: none;
		cursor: pointer;
		min-height: 44px; /* Touch-Target */
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.btn:hover { background: #3a7bc0; }
	.btn.secondary { background: #eee; color: #333; }
	.btn.secondary:hover { background: #ddd; }

	/* Mobile: Buttons volle Breite */
	@media (max-width: 640px) {
		.actions { flex-direction: column; }
		.btn { width: 100%; }
	}
</style>
