<script lang="ts">
	import { resultStore } from '$lib/stores/results.svelte';
	import { resetSession } from '$lib/stores/testSession.svelte';
	import DisclaimerBanner from '$lib/components/DisclaimerBanner.svelte';
	import { downloadResultJson, downloadResultCsv, downloadResultAsJson } from '$lib/export/downloadResult';
	import { t } from '$lib/i18n/ui';

	function restart() {
		resetSession();
	}

	function exportJson() {
		if (resultStore.result) downloadResultJson(resultStore.result);
	}

	function exportCsv() {
		if (resultStore.result) downloadResultCsv(resultStore.result);
	}

	function exportSimpleJson() {
		if (resultStore.result) downloadResultAsJson(resultStore.result, resultStore.result.instrument_id);
	}

	// Domain-Farben (Big-Five Standard)
	const colors: Record<string, string> = {
		E: '#e07b39', // Extraversion orange
		A: '#4caf50', // Agreeableness grün
		C: '#2196f3', // Conscientiousness blau
		N: '#f44336', // Neuroticism rot
		O: '#9c27b0'  // Openness lila
	};

	/** Perzentil-Anzeige: "P72" oder "–" */
	function pctLabel(p: number | null | undefined): string {
		return p === null || p === undefined ? '–' : `P${Math.round(p)}`;
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

	<!-- Domains mit Facetten + Balken -->
	<div class="domains">
		{#each resultStore.result.domains as domain}
			<section class="domain-card">
				<h2>{domain.label}</h2>

				<!-- Domain-Balken -->
				<div class="domain-row">
					<span class="dlabel">Ø</span>
					<div class="track">
						{#if domain.score !== null}
							<div class="fill" style="width: {(domain.score / 5) * 100}%; background: {colors[domain.domain_id] ?? '#4a90d9'}"></div>
							<span class="value">{domain.score.toFixed(2)}</span>
						{:else}
							<span class="value muted">–</span>
						{/if}
					</div>
					<span class="pct">{pctLabel(domain.percentile)}</span>
				</div>

				<!-- Facetten unter der Domain -->
				<div class="facets">
					{#each domain.facets as facet}
						<div class="facet-row">
							<span class="flabel">{facet.label}</span>
							<div class="track small">
								{#if facet.score !== null}
									<div class="fill" style="width: {(facet.score / 5) * 100}%; background: {colors[domain.domain_id] ?? '#4a90d9'}"></div>
									<span class="value">{facet.score.toFixed(2)}</span>
								{:else}
									<span class="value muted">–</span>
								{/if}
							</div>
							<span class="pct small">{pctLabel(facet.percentile)}</span>
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</div>

	<p class="norm-hint">
		P = Perzentil im Vergleich zur ESCS-Referenzstichprobe (Eugene-Springfield, n≈850). Werte 1–5 = Mittelwert der Antworten.
	</p>

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

	.domains { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem; }

	.domain-card {
		background: #fff;
		border: 1px solid #e2e2e2;
		border-radius: 12px;
		padding: 1.25rem;
	}
	.domain-card h2 {
		margin: 0 0 0.75rem 0;
		font-size: 1.1rem;
	}

	/* Domain-Zeile */
	.domain-row { display: flex; align-items: center; gap: 0.6rem; }
	.dlabel { width: 1.5rem; font-size: 0.8rem; color: #999; font-weight: 700; }
	.track {
		flex: 1;
		height: 24px;
		background: #f0f0f0;
		border-radius: 6px;
		position: relative;
		display: flex;
		align-items: center;
	}
	.fill { height: 100%; border-radius: 6px; transition: width 0.4s ease; }
	.value { position: absolute; right: 8px; font-size: 0.8rem; font-weight: 700; color: #333; }
	.value.muted { color: #aaa; }
	.pct {
		min-width: 3rem;
		text-align: right;
		font-size: 0.9rem;
		font-weight: 700;
		color: #4a90d9;
	}

	/* Facetten */
	.facets {
		margin-top: 0.75rem;
		padding-top: 0.5rem;
		border-top: 1px dashed #e8e8e8;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.facet-row { display: flex; align-items: center; gap: 0.6rem; }
	.flabel {
		width: 9rem;
		font-size: 0.78rem;
		color: #555;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.track.small { height: 14px; border-radius: 4px; }
	.track.small .fill { border-radius: 4px; }
	.track.small .value { font-size: 0.68rem; right: 6px; }
	.pct.small {
		min-width: 2.6rem;
		font-size: 0.75rem;
		color: #666;
	}

	.norm-hint { margin-top: 1rem; font-size: 0.75rem; color: #999; }

	.actions { display: flex; gap: 0.75rem; margin-top: 2.5rem; flex-wrap: wrap; }
	.btn {
		padding: 0.75rem 1.25rem;
		background: #4a90d9; color: #fff;
		border-radius: 8px; text-decoration: none; font-weight: 600;
		border: none;
		cursor: pointer;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.btn:hover { background: #3a7bc0; }
	.btn.secondary { background: #eee; color: #333; }
	.btn.secondary:hover { background: #ddd; }

	/* Mobile */
	@media (max-width: 640px) {
		.domain-card { padding: 1rem; }
		.flabel { width: 6.5rem; font-size: 0.72rem; }
		.pct.small { min-width: 2.2rem; }
		.actions { flex-direction: column; width: 100%; }
		.btn { width: 100%; }
	}
</style>
