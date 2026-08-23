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
	/** Aktuelle Frage (0-basiert) — One-at-a-time */
	let currentIndex = $state(0);

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
	const total = $derived(items.length);
	const currentItem = $derived(items[currentIndex]);
	const isLast = $derived(currentIndex >= total - 1);
	/** Antwort auf die aktuelle Frage schon gewählt? */
	const hasAnswer = $derived(currentItem ? getResponse(currentItem.item_id) !== undefined : false);

	function handleSelect(itemId: string, value: number) {
		const hadAnswer = getResponse(itemId) !== undefined;
		setResponse(itemId, value);
		// Automatisch weiter, außer die Frage wurde schon beantwortet (Korrektur beim Zurückgehen)
		if (!hadAnswer && !isLast && currentIndex < total - 1) {
			setTimeout(() => {
				currentIndex++;
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}, 150);
		}
	}

	function next() {
		if (isLast) {
			finish();
			return;
		}
		if (currentIndex < total - 1) {
			currentIndex++;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function prev() {
		if (currentIndex > 0) {
			currentIndex--;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
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
		<!-- ProgressBar oben: Position im Test + % -->
		<ProgressBar current={currentIndex + 1} total={total} />

		<div class="question-area">
			{#if currentItem}
				<QuestionCard
					text={translation.items[currentItem.item_id]?.text ?? currentItem.item_id}
					index={currentIndex}
					total={total}
					selected={getResponse(currentItem.item_id)}
					labels={translation.response_scale.labels}
					onSelect={(v) => handleSelect(currentItem.item_id, v)}
				/>
			{/if}

			<div class="nav">
				<button class="nav-btn" onclick={prev} disabled={currentIndex === 0}>
					← {t('run.prev')}
				</button>

				{#if isLast}
					<button class="nav-btn primary finish" onclick={next} disabled={!complete && !hasAnswer}>
						{t('run.finish')}
					</button>
				{:else}
					<button class="nav-btn primary" onclick={next} disabled={!hasAnswer}>
						{t('run.next')} →
					</button>
				{/if}
			</div>

			{#if !hasAnswer && !isLast}
				<p class="hint">{t('run.selectHint')}</p>
			{/if}
		</div>
	{:else}
		<p>{t('run.noScoring')}</p>
	{/if}
{/if}

<style>
	.question-area { margin-top: 1.25rem; }

	.nav {
		display: flex;
		gap: 0.75rem;
		margin-top: 1.25rem;
	}
	.nav-btn {
		flex: 1;
		padding: 0.9rem 1rem;
		border: 2px solid #e2e2e2;
		border-radius: 10px;
		background: #fff;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		min-height: 48px;
		color: #333;
		transition: all 0.15s;
	}
	.nav-btn:hover:not(:disabled) { border-color: #4a90d9; background: #f5f9ff; }
	.nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }

	.nav-btn.primary {
		background: #4a90d9;
		border-color: #4a90d9;
		color: #fff;
	}
	.nav-btn.primary:hover:not(:disabled) { background: #3a7bc0; border-color: #3a7bc0; }
	.nav-btn.primary:disabled { background: #b8d4f2; border-color: #b8d4f2; }

	.nav-btn.finish {
		background: #4caf50;
		border-color: #4caf50;
	}
	.nav-btn.finish:hover:not(:disabled) { background: #43a047; border-color: #43a047; }
	.nav-btn.finish:disabled { background: #b9e0bb; border-color: #b9e0bb; }

	.hint { color: #888; font-size: 0.85rem; text-align: center; margin-top: 0.75rem; }

	/* Mobile */
	@media (max-width: 640px) {
		.question-area { margin-top: 1rem; }
		.nav { gap: 0.5rem; }
		.nav-btn { padding: 0.85rem 0.5rem; font-size: 0.95rem; }
	}
</style>
