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

<!-- Hero -->
<section class="hero">
	<p class="hero-eyebrow">🧬 {t('landing.eyebrow')}</p>
	<h1 class="hero-title">{t('landing.title')}</h1>
	<p class="hero-sub">{t('landing.subtitle')}</p>
	<div class="hero-badges">
		<span class="hero-badge">✓ {t('landing.badge1')}</span>
		<span class="hero-badge">✓ {t('landing.badge2')}</span>
		<span class="hero-badge">✓ {t('landing.badge3')}</span>
	</div>
</section>

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

					<span class="cta">{t('landing.start')} →</span>
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
	/* Hero */
	.hero {
		text-align: center;
		padding: 2.5rem 0.5rem 2rem;
	}
	.hero-eyebrow {
		display: inline-block;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--brand-600);
		background: var(--brand-50);
		padding: 0.3rem 0.9rem;
		border-radius: 999px;
		margin: 0 0 1rem;
	}
	.hero-title {
		font-size: 2.4rem;
		margin: 0 0 0.75rem;
		letter-spacing: -0.03em;
	}
	.hero-sub {
		font-size: 1.1rem;
		color: var(--text-secondary);
		max-width: 560px;
		margin: 0 auto 1.25rem;
	}
	.hero-badges {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.hero-badge {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--text-secondary);
		background: rgba(255,255,255,0.8);
		border: 1px solid var(--card-border);
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
	}

	.loading { color: var(--text-muted); text-align: center; padding: 2rem 0; }

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
		padding: 1.4rem;
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--radius-lg);
		text-decoration: none;
		color: var(--text);
		box-shadow: var(--shadow-sm);
		transition: border-color 0.15s, box-shadow 0.2s, transform 0.2s;
	}
	.card:hover {
		border-color: var(--brand-400);
		box-shadow: var(--shadow-lg);
		transform: translateY(-3px);
		text-decoration: none;
	}

	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.75rem;
	}
	.name { font-weight: 700; font-size: 1.05rem; letter-spacing: -0.01em; }
	.duration { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; }

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

	.meta { font-size: 0.8rem; color: var(--text-muted); }

	.cta {
		margin-top: auto;
		padding: 0.6rem 1rem;
		background: linear-gradient(120deg, var(--brand-500), var(--accent));
		color: #fff;
		border-radius: var(--radius-md);
		font-size: 0.85rem; font-weight: 700;
		text-align: center;
		box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.card:hover .cta {
		transform: translateY(-1px);
		box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
	}

	/* Info-Box */
	.info-box {
		margin-top: 2.5rem;
		padding: 1.5rem 1.75rem;
		background: rgba(255, 255, 255, 0.85);
		border: 1px solid var(--card-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}
	.info-box h2 { margin-top: 0; font-size: 1.1rem; }
	.info-box ul { margin: 0.75rem 0; padding-left: 1.25rem; }
	.info-box li { margin: 0.35rem 0; color: var(--text-secondary); }
	.info-box a { color: var(--brand-600); }
	.info-note { margin-bottom: 0.75rem; font-size: 0.9rem; color: var(--text-secondary); }

	/* Mobile-Optimierung */
	@media (max-width: 640px) {
		.hero { padding: 1.75rem 0.25rem 1.5rem; }
		.hero-title { font-size: 1.8rem; }
		.hero-sub { font-size: 1rem; }
		.card-grid { grid-template-columns: 1fr; }
		.card { padding: 1.1rem; }
		.info-box { padding: 1.1rem 1.25rem; }
	}
</style>
