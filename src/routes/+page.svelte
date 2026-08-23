<script lang="ts">
	import { loadAvailableInstruments } from '$lib/data-loader/loadInstrument';
	import DisclaimerBanner from '$lib/components/DisclaimerBanner.svelte';
	import { TRANSLATION_STATUS_SHORT } from '$lib/i18n/status-labels';
	import type { TranslationStatus } from '$lib/scoring/types';

	interface InstrumentSummary {
		id: string;
		name: string;
		item_count: number;
		domains: string[];
		locales: string[];
		translation_status?: Record<string, TranslationStatus | null>;
	}

	let instruments = $state<InstrumentSummary[]>([]);

	$effect(() => {
		loadAvailableInstruments().then(list => {
			instruments = list;
		});
	});
</script>

<svelte:head>
	<title>personality-tests — Selbsttests zur Persönlichkeit</title>
</svelte:head>

<h1>Wissenschaftliche Persönlichkeitstests</h1>
<p class="intro">
	Freie, quelloffene Umsetzung etablierter Persönlichkeitsinventare.
	Keine Registrierung, keine Datenabgabe — alles läuft in deinem Browser.
</p>

<DisclaimerBanner message="Diese Tests sind kein klinisches Instrument und ersetzen keine psychologische Diagnostik." />

{#if instruments.length === 0}
	<p class="loading">Lade Instrumente…</p>
{:else}
	<ul class="instrument-list">
		{#each instruments as inst}
			<li>
				<a href="/{inst.id}">
					<span class="name">{inst.name}</span>
					<span class="meta">{inst.item_count} Items · {inst.domains.length} Domains · {inst.locales.join(', ')}</span>
					{#if inst.translation_status}
						<span class="badges">
							{#each inst.locales as loc}
								{@const st = inst.translation_status?.[loc]}
								{#if st}
									<span class="badge {st}">{loc}: {TRANSLATION_STATUS_SHORT[st]}</span>
								{/if}
							{/each}
						</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style>
	h1 { margin-bottom: 0.5rem; }
	.intro { color: #555; margin-bottom: 1.5rem; }
	.loading { color: #888; }
	.instrument-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
	.instrument-list a {
		display: flex; flex-direction: column; gap: 0.25rem;
		padding: 1rem 1.25rem;
		border: 1px solid #e2e2e2; border-radius: 10px;
		text-decoration: none; color: #222;
		transition: border-color 0.15s, box-shadow 0.15s;
	}
	.instrument-list a:hover { border-color: #4a90d9; box-shadow: 0 2px 10px rgba(74,144,217,0.15); }
	.name { font-weight: 600; }
	.meta { font-size: 0.8rem; color: #888; }
	.badges { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.25rem; }
	.badge {
		font-size: 0.7rem; font-weight: 600;
		padding: 0.1rem 0.5rem; border-radius: 999px;
		text-transform: uppercase; letter-spacing: 0.03em;
	}
	.badge.official_ipip { background: #e6f4ea; color: #1e7e34; }
	.badge.community_verified { background: #e8f0fe; color: #1a56db; }
	.badge.community_draft { background: #fef3c7; color: #92400e; }
	.badge.machine_draft { background: #f1f1f1; color: #555; }
</style>
