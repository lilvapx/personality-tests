<script lang="ts">
	import { parseImportedResult } from '$lib/export/importResult';
	import { setResult } from '$lib/stores/results.svelte';
	import { startSession, sessionStore } from '$lib/stores/testSession.svelte';
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n/ui';

	let error = $state<string | null>(null);
	let busy = $state(false);

	async function handleFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		busy = true;
		error = null;
		try {
			const text = await file.text();
			const imported = parseImportedResult(text);

			// Store befüllen: Ergebnis + Session (für Rohdaten/Prompt der Result-Seite)
			setResult(imported.result);

			// Session passend zum importierten Ergebnis aufsetzen
			const instrumentId = imported.result.instrument_id;
			startSession(instrumentId, imported.result.locale, undefined);
			sessionStore.responses.length = 0;
			sessionStore.responses.push(...imported.responses);

			goto(`/${instrumentId}/result`);
		} catch (err) {
			const code = err instanceof Error ? err.message : '';
			if (code === 'INVALID_JSON') {
				error = t('import.invalidJson');
			} else if (code === 'NOT_A_RESULT') {
				error = t('import.notAResult');
			} else {
				error = t('import.readError');
			}
		} finally {
			busy = false;
			input.value = '';
		}
	}
</script>

<div class="import-wrap">
	<label class="import-btn" class:busy>
		<span>{busy ? t('import.loading') : t('import.button')}</span>
		<input type="file" accept=".json,application/json" onchange={handleFile} hidden />
	</label>
	{#if error}
		<p class="import-error" role="alert">{error}</p>
	{/if}
</div>

<style>
	.import-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		align-items: flex-start;
	}
	.import-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.6rem 1.1rem;
		background: #fff;
		color: var(--text);
		border: 1px solid var(--card-border);
		border-radius: var(--radius-md);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		min-height: 44px;
		box-shadow: var(--shadow-sm);
		transition: border-color 0.15s, background 0.15s;
	}
	.import-btn:hover {
		border-color: var(--brand-400);
		background: var(--brand-50);
	}
	.import-btn.busy { opacity: 0.6; pointer-events: none; }
	.import-error {
		margin: 0;
		font-size: 0.8rem;
		color: #c62828;
	}
</style>
