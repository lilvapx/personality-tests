<script lang="ts">
	import { page } from '$app/state';
	import { loadInstrument, getTranslation } from '$lib/data-loader/loadInstrument';
	import type { InstrumentBundle } from '$lib/data-loader/loadInstrument';
	import { localeStore } from '$lib/stores/locale.svelte';
	import { sessionStore, setResponse, getResponse, startSession, isComplete } from '$lib/stores/testSession.svelte';
	import { setResult } from '$lib/stores/results.svelte';
	import { scoreTest } from '$lib/scoring';
	import { seededShuffle } from '$lib/scoring/shuffle';
	import QuestionCard from '$lib/components/QuestionCard.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n/ui';

	let bundle = $state<InstrumentBundle | null>(null);
	let notFound = $state(false);

	const instrumentId = $derived(page.params.instrument);

	$effect(() => {
		if (instrumentId) {
			loadInstrument(instrumentId).then(b => {
				if (b) {
					bundle = b;
					// Session sicherstellen
					if (!sessionStore.responses.length) startSession(b.id, localeStore.current);
				} else {
					notFound = true;
				}
			});
		}
	});

	const translation = $derived(bundle ? getTranslation(bundle, localeStore.current) : null);
	const items = $derived.by(() => {
		if (!bundle) return [];
		return bundle.randomize_order !== false && sessionStore.seed
			? seededShuffle(bundle.items, sessionStore.seed)
			: bundle.items;
	});
	const answeredCount = $derived(sessionStore.responses.length);
	const complete = $derived(bundle ? isComplete(bundle.items.length) : false);

	function handleSelect(itemId: string, value: number) {
		setResponse(itemId, value);
	}

	function finish() {
		if (!bundle || !translation) return;
		const result = scoreTest({
			instrumentId: bundle.id,
			locale: localeStore.current,
			items: bundle.items,
			domains: bundle.domains,
			scoring: bundle.scoring!,
			responses: sessionStore.responses.map(r => ({ ...r })),
			min: bundle.response_scale.min,
			max: bundle.response_scale.max
		});
		setResult(result);
		goto(`/${bundle.id}/result`);
	}
</script>

<svelte:head>
	<title>{t('run.title')}</title>
</svelte:head>

{#if notFound}
	<h1>{t('run.notfound')}</h1>
	<p><a href="/">{t('run.back')}</a></p>
{:else if bundle && translation}
	{#if bundle.scoring}
		<ProgressBar current={answeredCount} total={bundle.items.length} />

		<div class="questions">
			{#each items as item (item.item_id)}
				<QuestionCard
					text={translation.items[item.item_id]?.text ?? item.item_id}
					index={items.indexOf(item)}
					total={items.length}
					selected={getResponse(item.item_id)}
					labels={translation.response_scale.labels}
					onSelect={(v) => handleSelect(item.item_id, v)}
				/>
			{/each}
		</div>

		{#if complete}
			<button class="finish-btn" onclick={finish}>{t('run.finish')}</button>
		{:else}
			<p class="hint">{t('run.open', { n: bundle.items.length - answeredCount })}</p>
		{/if}
	{:else}
		<p>{t('run.noScoring')}</p>
	{/if}
{/if}

<style>
	.questions { display: flex; flex-direction: column; gap: 1rem; margin: 1.5rem 0; }
	.finish-btn {
		padding: 0.9rem 2rem;
		background: #4caf50; color: #fff;
		border: none; border-radius: 8px;
		font-weight: 600; font-size: 1rem; cursor: pointer;
		min-height: 48px;
	}
	.finish-btn:hover { background: #43a047; }
	.hint { color: #888; font-size: 0.9rem; }

	/* Mobile */
	@media (max-width: 640px) {
		.questions { gap: 0.75rem; margin: 1rem 0; }
		.finish-btn { width: 100%; }
	}
</style>
