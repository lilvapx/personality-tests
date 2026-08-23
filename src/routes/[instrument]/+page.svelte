<script lang="ts">
	import { page } from '$app/state';
	import { loadInstrument, getTranslation } from '$lib/data-loader/loadInstrument';
	import type { InstrumentBundle } from '$lib/data-loader/loadInstrument';
	import { startSession } from '$lib/stores/testSession.svelte';
	import { currentLocale } from '$lib/stores/locale.svelte';
	import DisclaimerBanner from '$lib/components/DisclaimerBanner.svelte';

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

	const translation = $derived(bundle ? getTranslation(bundle, currentLocale) : null);
</script>

<svelte:head>
	<title>{bundle?.name ?? 'Instrument'} — personality-tests</title>
</svelte:head>

{#if notFound}
	<h1>Instrument nicht gefunden</h1>
	<p><a href="/">← Zur Übersicht</a></p>
{:else if bundle && translation}
	<h1>{bundle.name}</h1>
	<p class="citation">{bundle.source_citation}</p>

	<DisclaimerBanner message="Kein klinisches Instrument. Die Auswertung ist rein informativ und ersetzt keine professionelle Diagnostik." />

	<h2>Über diesen Test</h2>
	<ul class="facts">
		<li><strong>{bundle.items.length}</strong> Items</li>
		<li><strong>{bundle.domains.length}</strong> Domains</li>
		<li>Antwortskala: <strong>{bundle.response_scale.min}–{bundle.response_scale.max}</strong></li>
		<li>Dauer: ca. {Math.round(bundle.items.length / 10)} Minuten</li>
	</ul>

	<p>
		Deine Antworten werden <strong>nur lokal in deinem Browser</strong> verarbeitet
		und nach der Sitzung verworfen.
	</p>

	<a
		class="start-btn"
		href="/{bundle?.id}/run"
		onclick={() => bundle && startSession(bundle.id, currentLocale)}
	>
		Test starten →
	</a>
{:else}
	<p>Lade…</p>
{/if}

<style>
	.citation { font-size: 0.85rem; color: #777; font-style: italic; }
	.facts { list-style: none; padding: 0; display: flex; gap: 1.5rem; flex-wrap: wrap; }
	.facts li { background: #f7f7f7; padding: 0.5rem 1rem; border-radius: 8px; }
	.start-btn {
		display: inline-block;
		margin-top: 1.5rem;
		padding: 0.9rem 2rem;
		background: #4a90d9; color: #fff;
		border-radius: 8px; text-decoration: none;
		font-weight: 600;
	}
	.start-btn:hover { background: #3a7bc0; }
</style>
