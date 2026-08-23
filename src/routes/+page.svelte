<script lang="ts">
	import { loadAvailableInstruments } from '$lib/data-loader/loadInstrument';
	import DisclaimerBanner from '$lib/components/DisclaimerBanner.svelte';

	let instruments = $state<Array<{ id: string; name: string; item_count: number; domains: string[]; locales: string[] }>>([]);

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
</style>
