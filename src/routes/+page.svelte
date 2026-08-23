<script lang="ts">
	import { loadAvailableInstruments } from '$lib/data-loader/loadInstrument';
	import DisclaimerBanner from '$lib/components/DisclaimerBanner.svelte';
	import { t, TRANSLATION_STATUS_SHORT } from '$lib/i18n/ui';
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

<h1>{t('landing.title')}</h1>

<!-- Testauswahl als Cards -->
{#if instruments.length === 0}
	<p class="loading">{t('landing.loading')}</p>
{:else}
	<ul class="card-grid">
		{#each instruments as inst}
			<li>
				<a href="/{inst.id}" class="card">
					<span class="card-head">
						<span class="name">{inst.name}</span>
						<span class="duration">≈ {Math.round(inst.item_count / 10)} {t('landing.minutes')}</span>
					</span>

					<span class="badges">
						{#each inst.locales as loc}
							{@const st = inst.translation_status?.[loc]}
							{#if st}
								<span class="badge {st}">{loc.toUpperCase()}: {t(TRANSLATION_STATUS_SHORT[st])}</span>
							{/if}
						{/each}
					</span>

					<span class="meta">{inst.item_count} Items · {inst.domains.length} Domains</span>

					<span class="cta">{t('landing.start')}</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}

<!-- Abgegrenztes Info-Feld drunter -->
<aside class="info-box">
	<h2>{t('landing.about.title')}</h2>
	<p>
		{t('landing.about.text')}
	</p>
	<ul>
		<li>{t('landing.about.p1')}</li>
		<li>{t('landing.about.p2')}</li>
		<li>{t('landing.about.p3')}</li>
		<li>{@html t('landing.about.p4', { github: '<a href="https://github.com/lilvapx/personality-tests" target="_blank" rel="noopener">GitHub</a>' })}</li>
	</ul>
	<p class="info-note">
		{@html t('landing.about.note', { strong: '<strong>', '/strong': '</strong>' })}
	</p>
	<DisclaimerBanner message={t('landing.disclaimer')} />
</aside>

<style>
	h1 { margin-bottom: 1.25rem; }
	.loading { color: #888; }

	/* Card-Grid: 2 Spalten auf Desktop, 1 auf Mobile */
	.card-grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		height: 100%;
		padding: 1.25rem;
		background: #fff;
		border: 1px solid #e2e2e2;
		border-radius: 14px;
		text-decoration: none;
		color: #222;
		box-shadow: 0 1px 4px rgba(0,0,0,0.04);
		transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
	}
	.card:hover {
		border-color: #4a90d9;
		box-shadow: 0 4px 16px rgba(74,144,217,0.18);
		transform: translateY(-2px);
	}

	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.75rem;
	}
	.name { font-weight: 700; font-size: 1.05rem; }
	.duration { font-size: 0.75rem; color: #999; white-space: nowrap; }

	.badges { display: flex; gap: 0.35rem; flex-wrap: wrap; }
	.badge {
		font-size: 0.68rem; font-weight: 600;
		padding: 0.12rem 0.5rem; border-radius: 999px;
		text-transform: uppercase; letter-spacing: 0.03em;
	}
	.badge.official_ipip { background: #e6f4ea; color: #1e7e34; }
	.badge.community_verified { background: #e8f0fe; color: #1a56db; }
	.badge.community_draft { background: #fef3c7; color: #92400e; }
	.badge.machine_draft { background: #f1f1f1; color: #555; }

	.meta { font-size: 0.8rem; color: #888; }

	.cta {
		margin-top: auto;
		padding: 0.55rem 1rem;
		background: #4a90d9; color: #fff;
		border-radius: 8px; font-size: 0.85rem; font-weight: 600;
		text-align: center;
		transition: background 0.15s;
	}
	.card:hover .cta { background: #3a7bc0; }

	/* Info-Box */
	.info-box {
		margin-top: 2.5rem;
		padding: 1.25rem 1.5rem;
		background: #f7f9fc;
		border: 1px solid #e2e2e2;
		border-radius: 14px;
	}
	.info-box h2 { margin-top: 0; font-size: 1.05rem; }
	.info-box ul { margin: 0.75rem 0; padding-left: 1.25rem; }
	.info-box li { margin: 0.35rem 0; }
	.info-box a { color: #4a90d9; }
	.info-note { margin-bottom: 0.75rem; font-size: 0.9rem; color: #555; }

	/* Mobile-Optimierung */
	@media (max-width: 640px) {
		.card-grid { grid-template-columns: 1fr; }
		.card { padding: 1rem; }
		h1 { font-size: 1.5rem; }
	}
</style>
