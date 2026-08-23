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
	.citation { font-size: 0.85rem; color: #777; font-style: italic; }
	.facts { list-style: none; padding: 0; display: flex; gap: 0.75rem; flex-wrap: wrap; }
	.facts li { background: #f7f7f7; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.9rem; }
	.start-btn {
		display: inline-block;
		margin-top: 1.5rem;
		padding: 0.9rem 2rem;
		background: #4a90d9; color: #fff;
		border-radius: 8px; text-decoration: none;
		font-weight: 600;
		min-height: 44px;
	}
	.start-btn:hover { background: #3a7bc0; }

	/* Mobile */
	@media (max-width: 640px) {
		.start-btn { width: 100%; text-align: center; }
		.facts { flex-direction: column; }
		.facts li { width: 100%; box-sizing: border-box; }
	}
</style>
