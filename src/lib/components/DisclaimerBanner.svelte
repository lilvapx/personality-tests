<script lang="ts">
	import type { TranslationStatus } from '$lib/scoring/types';
	import { t, TRANSLATION_STATUS_LABELS, TRANSLATION_STATUS_SHORT } from '$lib/i18n/ui';

	interface Props {
		message?: string;
		/** Optional: Übersetzungsstatus anzeigen (mit Badge) */
		status?: TranslationStatus | null;
		/** Optional: Sprache, auf die sich der Status bezieht */
		statusLocale?: string | null;
	}

	let { message = 'Hinweis', status = null, statusLocale = null }: Props = $props();
</script>

<div class="disclaimer">
	<div class="main">
		⚠️ {message}
	</div>

	{#if status}
		{@const info = TRANSLATION_STATUS_LABELS[status]}
		<div class="status-row">
			<span class="badge {info.tone}">{t(TRANSLATION_STATUS_SHORT[status])}</span>
			<span class="status-text">
				{t(info.labelKey)}{statusLocale ? ` (${statusLocale})` : ''}: {t(info.descKey)}
			</span>
		</div>
	{/if}
</div>

<style>
	.disclaimer {
		padding: 0.75rem 1rem;
		background: #fff8e1;
		border-left: 4px solid #f0ad4e;
		border-radius: 4px;
		font-size: 0.85rem;
		color: #6d5a00;
	}
	.main { margin-bottom: 0.25rem; }
	.status-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
		flex-wrap: wrap;
	}
	.badge {
		display: inline-block;
		padding: 0.15rem 0.6rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}
	.badge.green { background: #e6f4ea; color: #1e7e34; }
	.badge.blue { background: #e8f0fe; color: #1a56db; }
	.badge.amber { background: #fef3c7; color: #92400e; }
	.badge.gray { background: #f1f1f1; color: #555; }
	.status-text { color: #6d5a00; }
</style>
