<script lang="ts">
	import { page } from '$app/state';
	import { loadInstrument, getTranslation } from '$lib/data-loader/loadInstrument';
	import type { InstrumentBundle } from '$lib/data-loader/loadInstrument';
	import { startSession } from '$lib/stores/testSession.svelte';
	import { localeStore } from '$lib/stores/locale.svelte';
	import DisclaimerBanner from '$lib/components/DisclaimerBanner.svelte';
	import { t, TRANSLATION_STATUS_LABELS } from '$lib/i18n/ui';

	let bundle = $state<InstrumentBundle | null>(null);
	let notFound = $state(false);

	const instrumentId = $derived(page.params.instrument);

	$effect(() => {
		if (instrumentId) {
			loadInstrument(instrumentId).then(b => {
				if (b) bundle = b;
				else notFound = true;
			});
		}
	});

	const translation = $derived(bundle ? getTranslation(bundle, localeStore.current) : null);
	const translationStatus = $derived(translation?.translation_status ?? null);
	const activeLocale = $derived(translation?.locale ?? null);
</script>

<svelte:head>
	<title>{bundle?.name ?? 'Instrument'} — personality-tests</title>
</svelte:head>

{#if notFound}
	<h1>{t('instrument.notfound')}</h1>
	<p><a href="/">{t('instrument.back')}</a></p>
{:else if bundle && translation}
	<h1>{bundle.name}</h1>
	<p class="citation">{bundle.source_citation}</p>

	<DisclaimerBanner
		message={t('result.disclaimer')}
		status={translationStatus}
		statusLocale={activeLocale}
	/>

	<h2>{t('instrument.about')}</h2>
	<ul class="facts">
		<li><strong>{bundle.items.length}</strong> {t('instrument.items')}</li>
		<li><strong>{bundle.domains.length}</strong> {t('instrument.domains')}</li>
		<li>{t('instrument.scale')}: <strong>{bundle.response_scale.min}–{bundle.response_scale.max}</strong></li>
		<li>{t('instrument.duration', { n: Math.round(bundle.items.length / 10) })}</li>
	</ul>

	<p>
		{@html t('instrument.privacy', { strong: '<strong>', '/strong': '</strong>' })}
	</p>

	<a
		class="start-btn"
		href="/{bundle?.id}/run"
		onclick={() => bundle && startSession(bundle.id, localeStore.current)}
	>
		{t('instrument.start')}
	</a>
{:else}
	<p>{t('instrument.loading')}</p>
{/if}

<style>
	.citation { font-size: 0.85rem; color: var(--text-muted); font-style: italic; }
	.facts { list-style: none; padding: 0; display: flex; gap: 0.75rem; flex-wrap: wrap; }
	.facts li { background: rgba(255,255,255,0.85); border: 1px solid var(--card-border); padding: 0.5rem 1rem; border-radius: var(--radius-sm); font-size: 0.9rem; }
	.start-btn {
		display: inline-block;
		margin-top: 1.5rem;
		padding: 0.9rem 2rem;
		background: linear-gradient(120deg, var(--brand-500), var(--accent));
		color: #fff;
		border-radius: var(--radius-md);
		text-decoration: none;
		font-weight: 700;
		min-height: 44px;
		box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.start-btn:hover {
		background: linear-gradient(120deg, var(--brand-600), var(--accent));
		transform: translateY(-1px);
		box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
		text-decoration: none;
	}

	/* Mobile */
	@media (max-width: 640px) {
		.start-btn { width: 100%; text-align: center; }
		.facts { flex-direction: column; }
		.facts li { width: 100%; box-sizing: border-box; }
	}
</style>
