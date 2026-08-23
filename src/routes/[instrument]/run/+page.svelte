<script lang="ts">
	import { page } from '$app/state';
	import { loadInstrument, getTranslation } from '$lib/data-loader/loadInstrument';
	import type { InstrumentBundle } from '$lib/data-loader/loadInstrument';
	import { currentLocale } from '$lib/stores/locale';
	import { responses, setResponse, getResponse, startSession, isComplete } from '$lib/stores/testSession';
	import { setResult } from '$lib/stores/results';
	import { scoreTest } from '$lib/scoring';
	import QuestionCard from '$lib/components/QuestionCard.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { goto } from '$app/navigation';

	let bundle = $state<InstrumentBundle | null>(null);
	let notFound = $state(false);

	const instrumentId = $derived(page.params.instrument);

	$effect(() => {
		if (instrumentId) {
			loadInstrument(instrumentId).then(b => {
				if (b) {
					bundle = b;
					// Session sicherstellen
					if (!responses.length) startSession(b.id, currentLocale);
				} else {
					notFound = true;
				}
			});
		}
	});

	const translation = $derived(bundle ? getTranslation(bundle, currentLocale) : null);
	const items = $derived(bundle?.items ?? []);
	const answeredCount = $derived(responses.length);
	const complete = $derived(bundle ? isComplete(bundle.items.length) : false);

	function handleSelect(itemId: string, value: number) {
		setResponse(itemId, value);
	}

	function finish() {
		if (!bundle || !translation) return;
		const result = scoreTest({
			instrumentId: bundle.id,
			locale: currentLocale,
			items: bundle.items,
			domains: bundle.domains,
			scoring: bundle.scoring!,
			responses: responses.map(r => ({ ...r })),
			min: bundle.response_scale.min,
			max: bundle.response_scale.max
		});
		setResult(result);
		goto(`/${bundle.id}/result`);
	}
</script>

<svelte:head>
	<title>Testlauf — personality-tests</title>
</svelte:head>

{#if notFound}
	<h1>Instrument nicht gefunden</h1>
	<p><a href="/">← Zur Übersicht</a></p>
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
			<button class="finish-btn" onclick={finish}>Auswertung anzeigen →</button>
		{:else}
			<p class="hint">Noch {bundle.items.length - answeredCount} Fragen offen.</p>
		{/if}
	{:else}
		<p>Für dieses Instrument ist noch keine Scoring-Konfiguration hinterlegt.</p>
	{/if}
{/if}

<style>
	.questions { display: flex; flex-direction: column; gap: 1rem; margin: 1.5rem 0; }
	.finish-btn {
		padding: 0.9rem 2rem;
		background: #4caf50; color: #fff;
		border: none; border-radius: 8px;
		font-weight: 600; font-size: 1rem; cursor: pointer;
	}
	.finish-btn:hover { background: #43a047; }
	.hint { color: #888; font-size: 0.9rem; }
</style>
