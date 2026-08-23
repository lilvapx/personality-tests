<script lang="ts">
	import { page } from '$app/state';
	import { resultStore } from '$lib/stores/results.svelte';
	import { sessionStore } from '$lib/stores/testSession.svelte';
	import { resetSession } from '$lib/stores/testSession.svelte';
	import DisclaimerBanner from '$lib/components/DisclaimerBanner.svelte';
	import { downloadResultJson, downloadResultCsv, downloadResultAsJson } from '$lib/export/downloadResult';
	import { loadInstrument } from '$lib/data-loader/loadInstrument';
	import type { InstrumentBundle } from '$lib/data-loader/loadInstrument';
	import { localeStore } from '$lib/stores/locale.svelte';
	import { buildPrompt } from '$lib/scoring/prompt';
	import { t } from '$lib/i18n/ui';

	let copied = $state(false);
	let bundle = $state<InstrumentBundle | null>(null);

	const instrumentId = $derived(page.params.instrument);
	const scaleMin = $derived(bundle?.response_scale.min ?? 1);
	const scaleMax = $derived(bundle?.response_scale.max ?? 5);

	// Bundle laden (für Items + Metadaten der Rohdaten-Ausgabe)
	$effect(() => {
		if (instrumentId) {
			loadInstrument(instrumentId).then(b => {
				bundle = b;
			});
		}
	});

	/** Rohdaten-JSON für die Copy-Textbox */
	const rawJson = $derived.by(() => {
		if (!resultStore.result || !bundle) return null;

		// Item-Texte in der Test-Locale (Fallback: erste verfügbare Locale)
		const locale = resultStore.result.locale;
		const translation = bundle.i18n[locale] ?? bundle.i18n[bundle.locales[0]];
		const itemTexts: Record<string, string> = {};
		if (translation) {
			for (const [iid, v] of Object.entries(translation.items)) {
				itemTexts[iid] = v.text;
			}
		}

		return buildPrompt({
			result: resultStore.result,
			items: bundle.items,
			responses: sessionStore.responses.map(r => ({ ...r })),
			itemTexts,
			name: bundle.name,
			version: bundle.version,
			scaleMin: bundle.response_scale.min,
			scaleMax: bundle.response_scale.max
		});
	});

	const rawText = $derived(rawJson ? JSON.stringify(rawJson, null, 2) : '');

	async function copyRaw() {
		if (!rawText) return;
		try {
			await navigator.clipboard.writeText(rawText);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Fallback: Textarea selektieren
			const ta = document.querySelector<HTMLTextAreaElement>('#raw-summary');
			if (ta) {
				ta.select();
				document.execCommand('copy');
				copied = true;
				setTimeout(() => (copied = false), 2000);
			}
		}
	}

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

	/** Perzentil-Anzeige: "12%" oder "–" */
	function pctLabel(p: number | null | undefined): string {
		return p === null || p === undefined ? '–' : `${Math.round(p)}%`;
	}

	/**
	 * Reaktive Labels: Domain-/Facet-Namen in der AKTUELLEN UI-Sprache.
	 * Die im Ergebnis eingefrorenen Labels sind in der Test-Sprache —
	 * beim Sprachwechsel soll die Auswertung aber mitwechseln.
	 */
	const uiLabels = $derived.by(() => {
		if (!bundle) return { domains: {}, facets: {} };
		const translation = bundle.i18n[localeStore.current] ?? bundle.i18n[bundle.locales[0]];
		return {
			domains: translation?.labels?.domains ?? {},
			facets: translation?.labels?.facets ?? {}
		};
	});

	function domainLabel(domain: { domain_id: string; label: string; label_en?: string }): string {
		return uiLabels.domains[domain.domain_id] ?? domain.label;
	}
	function facetLabel(facet: { facet_id: string; label: string; label_en?: string }): string {
		return uiLabels.facets[facet.facet_id] ?? facet.label;
	}

	/** Name + Original klein/kursiv dahinter (nur wenn abweichend) */
	function nameWithOriginal(label: string, labelEn: string | undefined): string {
		if (!labelEn || labelEn === label) return label;
		return label;
	}

	/**
	 * Balken-Breite: Perzentil bevorzugen (0-100 → %), sonst normierter Rohwert.
	 * Verhindert den „1%-Perzentil aber riesiger Balken“-Bug.
	 */
	function barWidth(score: number | null, percentile: number | null | undefined): string {
		if (percentile !== null && percentile !== undefined) {
			return `${Math.max(2, Math.min(100, percentile))}%`;
		}
		if (score === null) return '0%';
		const span = scaleMax - scaleMin;
		if (span <= 0) return '0%';
		const norm = ((score - scaleMin) / span) * 100;
		return `${Math.max(2, Math.min(100, norm))}%`;
	}
</script>

<svelte:head>
	<title>{t('result.title')}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if resultStore.result}
	<h1>{t('result.heading')}</h1>
	<p class="meta">
		{resultStore.result.instrument_id} · {resultStore.result.locale} · {new Date(resultStore.result.completed_at).toLocaleString()}
	</p>

	<!-- ⚠️ WICHTIG: Perzentil-Kontext transparent kommunizieren -->
	<div class="norm-warning">
		<p class="norm-warning-title">{@html t('result.normWarnTitle')}</p>
		<ul>
			<li>{@html t('result.normWarn1')}</li>
			<li>{@html t('result.normWarn2')}</li>
			<li>{@html t('result.normWarn3')}</li>
			<li>{@html t('result.normWarn4')}</li>
		</ul>
	</div>

	<DisclaimerBanner message={t('result.disclaimer')} />

	<!-- Domains mit Facetten + Balken -->
	<div class="domains">
		{#each resultStore.result.domains as domain}
			<section class="domain-card">
				<h2>
					{domainLabel(domain)}
					{#if domain.label_en && domain.label_en !== domainLabel(domain)}
						<span class="orig">({domain.label_en})</span>
					{/if}
				</h2>

				<!-- Domain-Balken -->
				<div class="domain-row">
					<span class="dlabel">Ø</span>
					<div class="track">
						{#if domain.score !== null}
							<div class="fill" style="width: {barWidth(domain.score, domain.percentile)}; background: {colors[domain.domain_id] ?? '#4a90d9'}"></div>
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
							<span class="flabel">
								{facetLabel(facet)}
								{#if facet.label_en && facet.label_en !== facetLabel(facet)}
									<span class="orig">({facet.label_en})</span>
								{/if}
							</span>
							<div class="track small">
								{#if facet.score !== null}
									<div class="fill" style="width: {barWidth(facet.score, facet.percentile)}; background: {colors[domain.domain_id] ?? '#4a90d9'}"></div>
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
		{t('result.normHint')}
	</p>

	<div class="actions">
		<a href="/" class="btn" onclick={restart}>{t('result.overview')}</a>
		<a href="/methodology" class="btn secondary">{t('result.methodology')}</a>
		<button class="btn secondary" onclick={exportJson}>{t('result.exportJson')}</button>
		<button class="btn secondary" onclick={exportCsv}>{t('result.exportCsv')}</button>
	</div>

	<!-- Rohdaten-Textbox + Copy-Button (ganz unten) -->
	<div class="raw-box">
		<div class="raw-header">
			<h2>{t('result.copyTitle')}</h2>
			<button class="btn small" onclick={copyRaw}>
				{copied ? t('result.copied') : t('result.copy')}
			</button>
		</div>
		<p class="raw-hint">{t('result.copyHint')}</p>
		<textarea id="raw-summary" readonly rows="22" spellcheck="false">{rawText}</textarea>
	</div>
{:else}
	<h1>{t('result.none')}</h1>
	<p>{t('result.noneText')}</p>
	<a href="/" class="btn">{t('result.overview')}</a>
{/if}

<style>
	.meta { color: #888; font-size: 0.85rem; }

	/* ⚠️ Norm-Warnung — prominent */
	.norm-warning {
		background: #fff8e1;
		border: 2px solid #f0c040;
		border-left: 6px solid #e6a800;
		border-radius: 10px;
		padding: 1rem 1.25rem;
		margin: 1.25rem 0;
	}
	.norm-warning-title {
		margin: 0 0 0.5rem 0;
		font-size: 0.95rem;
		color: #6d4c00;
	}
	.norm-warning ul {
		margin: 0;
		padding-left: 1.25rem;
		color: #6d4c00;
		font-size: 0.85rem;
		line-height: 1.55;
	}
	.norm-warning li { margin-bottom: 0.35rem; }

	.domains { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem; }

	.domain-card {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		box-shadow: var(--shadow-sm);
	}
	.domain-card h2 {
		margin: 0 0 0.75rem 0;
		font-size: 1.1rem;
	}

	/* Original-Name klein + kursiv hinter der Übersetzung */
	.orig {
		font-size: 0.75em;
		font-weight: 400;
		font-style: italic;
		color: var(--text-muted);
		margin-left: 0.3em;
	}

	/* Domain-Zeile */
	.domain-row { display: flex; align-items: center; gap: 0.6rem; }
	.dlabel { width: 1.5rem; font-size: 0.8rem; color: var(--text-muted); font-weight: 700; }
	.track {
		flex: 1;
		height: 24px;
		background: #f0f2f7;
		border-radius: 6px;
		position: relative;
		display: flex;
		align-items: center;
		overflow: hidden;
	}
	.fill { height: 100%; border-radius: 6px; transition: width 0.4s ease; }
	.value { position: absolute; right: 8px; font-size: 0.8rem; font-weight: 700; color: #333; }
	.value.muted { color: #aaa; }
	.pct {
		min-width: 3rem;
		text-align: right;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--brand-600);
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
		width: 10rem;
		font-size: 0.78rem;
		color: #555;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex-shrink: 0;
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

	/* Rohdaten-Textbox */
	.raw-box {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--radius-lg);
		padding: 1.25rem;
		margin-top: 1.5rem;
		box-shadow: var(--shadow-sm);
	}
	.raw-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.raw-header h2 {
		margin: 0;
		font-size: 1rem;
	}
	.raw-hint {
		margin: 0.35rem 0 0.75rem 0;
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	#raw-summary {
		width: 100%;
		min-height: 8rem;
		padding: 0.75rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.78rem;
		line-height: 1.5;
		color: #333;
		background: #fafbfc;
		border: 1px solid var(--card-border);
		border-radius: var(--radius-md);
		resize: vertical;
		box-sizing: border-box;
	}
	.btn.small {
		padding: 0.4rem 0.9rem;
		font-size: 0.8rem;
		min-height: 36px;
		box-shadow: none;
	}

	.actions { display: flex; gap: 0.75rem; margin-top: 2.5rem; flex-wrap: wrap; }
	.btn {
		padding: 0.75rem 1.25rem;
		background: linear-gradient(120deg, var(--brand-500), var(--accent));
		color: #fff;
		border-radius: var(--radius-md);
		text-decoration: none;
		font-weight: 700;
		border: none;
		cursor: pointer;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.btn:hover {
		background: linear-gradient(120deg, var(--brand-600), var(--accent));
		transform: translateY(-1px);
		box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
	}
	.btn.secondary { background: #fff; color: var(--text); border: 1px solid var(--card-border); box-shadow: none; }
	.btn.secondary:hover { background: var(--brand-50); border-color: var(--brand-400); }

	/* Mobile */
	@media (max-width: 640px) {
		.domain-card { padding: 1rem; }
		.flabel { width: 7.5rem; font-size: 0.72rem; }
		.pct.small { min-width: 2.2rem; }
		.actions { flex-direction: column; width: 100%; }
		.btn { width: 100%; }
	}
</style>
