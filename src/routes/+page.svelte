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
	<meta name="description" content="Freie, quelloffene wissenschaftliche Persönlichkeitstests (IPIP-NEO). Keine Registrierung, keine Datenabgabe — alles läuft in deinem Browser." />
</svelte:head>

<h1>Wissenschaftliche Persönlichkeitstests</h1>

<!-- Testauswahl zuerst -->
{#if instruments.length === 0}
	<p class="loading">Lade Instrumente…</p>
{:else}
	<ul class="instrument-list">
		{#each instruments as inst}
			<li>
				<a href="/{inst.id}" class="instrument-card">
					<span class="card-top">
						<span class="name">{inst.name}</span>
						<span class="duration">ca. {Math.round(inst.item_count / 10)} Min.</span>
					</span>
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
					<span class="cta">Test starten →</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}

<!-- Abgegrenztes Info-Feld drunter -->
<aside class="info-box">
	<h2>Über diese Tests</h2>
	<p>
		Freie, quelloffene Umsetzung etablierter Persönlichkeitsinventare —
		derzeit die IPIP-NEO-Reihe (International Personality Item Pool).
	</p>
	<ul>
		<li>✅ Keine Registrierung, keine Datenabgabe</li>
		<li>✅ Alle Auswertungen laufen lokal in deinem Browser</li>
		<li>✅ Ergebnisse werden nicht gespeichert — nur du siehst sie</li>
		<li>✅ Quelloffen auf <a href="https://github.com/lilvapx/personality-tests" target="_blank" rel="noopener">GitHub</a></li>
	</ul>
	<p class="info-note">
		Die Tests basieren auf wissenschaftlichen Modellen (Big Five / Fünf-Faktoren-Modell) und dienen
		der Selbstreflexion. Sie sind <strong>kein klinisches Instrument</strong> und ersetzen keine
		psychologische Diagnostik.
	</p>
	<DisclaimerBanner message="Hinweis: Übersetzungen mit dem Status „Entwurf“ sind ungeprüfte eigene/Community-Übersetzungen — die englischen Original-Items sind maßgeblich." />
</aside>

<style>
	h1 { margin-bottom: 1.5rem; }
	.loading { color: #888; }
	.instrument-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
	.instrument-card {
		display: flex; flex-direction: column; gap: 0.25rem;
		padding: 1rem 1.25rem;
		border: 1px solid #e2e2e2; border-radius: 10px;
		text-decoration: none; color: #222;
		transition: border-color 0.15s, box-shadow 0.15s;
	}
	.instrument-card:hover { border-color: #4a90d9; box-shadow: 0 2px 10px rgba(74,144,217,0.15); }
	.card-top { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
	.name { font-weight: 600; }
	.duration { font-size: 0.75rem; color: #999; white-space: nowrap; }
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
	.cta {
		align-self: flex-start;
		margin-top: 0.5rem;
		padding: 0.4rem 1rem;
		background: #4a90d9; color: #fff;
		border-radius: 6px; font-size: 0.85rem; font-weight: 600;
		transition: background 0.15s;
	}
	.instrument-card:hover .cta { background: #3a7bc0; }

	.info-box {
		margin-top: 2.5rem;
		padding: 1.25rem 1.5rem;
		background: #f7f9fc;
		border: 1px solid #e2e2e2;
		border-radius: 10px;
	}
	.info-box h2 { margin-top: 0; font-size: 1.05rem; }
	.info-box ul { margin: 0.75rem 0; padding-left: 1.25rem; }
	.info-box li { margin: 0.35rem 0; }
	.info-box a { color: #4a90d9; }
	.info-note { margin-bottom: 0.75rem; font-size: 0.9rem; color: #555; }
</style>
