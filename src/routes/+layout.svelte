<script lang="ts">
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import ConsentBanner from '$lib/components/ConsentBanner.svelte';
	import { t } from '$lib/i18n/ui';
	import { localeStore, applySavedLocale } from '$lib/stores/locale.svelte';
	import { initConsent, consentStore } from '$lib/stores/consent.svelte';
	import { initAdsense } from '$lib/stores/adsense.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		applySavedLocale();
		initConsent();
		initAdsense();
	});

	function openConsentSettings() {
		consentStore.showSettings = true;
	}
</script>

<svelte:head>
	<html lang={localeStore.current} />
</svelte:head>

<header class="site-header">
	<div class="header-inner">
		<a href="/" class="logo">
			<span class="logo-mark">🧬</span>
			<span class="logo-text">{t('nav.logo')}</span>
		</a>
		<LanguageSwitcher />
	</div>
</header>

<main>
	<slot />
</main>

<ConsentBanner />

<footer class="site-footer">
	<div class="footer-inner">
		<p class="footer-note">{t('footer.note')}</p>
		<nav class="footer-links">
			<a href="/impressum">{t('footer.impressum')}</a>
			<span class="sep">·</span>
			<a href="/datenschutz">{t('footer.datenschutz')}</a>
			<span class="sep">·</span>
			<button class="link-btn" onclick={openConsentSettings}>{t('consent.settings')}</button>
		</nav>
	</div>
</footer>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(229, 233, 240, 0.9);
	}
	.header-inner {
		max-width: 820px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.7rem 1rem;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 800;
		font-size: 1.05rem;
		text-decoration: none;
		color: var(--text);
	}
	.logo-mark { font-size: 1.2rem; }
	.logo-text { letter-spacing: -0.01em; }
	.logo:hover .logo-text { color: var(--brand-600); }
	.logo:hover { text-decoration: none; }

	main {
		max-width: 820px;
		margin: 1.75rem auto 3rem;
		padding: 0 1rem;
		min-height: 62vh;
	}

	.site-footer {
		border-top: 1px solid rgba(229, 233, 240, 0.9);
		background: rgba(255, 255, 255, 0.5);
	}
	.footer-inner {
		max-width: 820px;
		margin: 0 auto;
		text-align: center;
		padding: 1.5rem 1rem;
		color: var(--text-muted);
		font-size: 0.8rem;
	}
	.footer-note { margin: 0 0 0.5rem; }
	.footer-links { display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap; }
	.footer-links a { color: var(--text-secondary); text-decoration: none; padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); }
	.footer-links a:hover { color: var(--brand-600); background: var(--brand-50); text-decoration: none; }
	.link-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		font-size: inherit;
		font-family: inherit;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
	}
	.link-btn:hover { color: var(--brand-600); background: var(--brand-50); }
	.sep { color: #d5dbe5; }

	/* Mobile */
	@media (max-width: 640px) {
		.header-inner { padding: 0.55rem 0.75rem; }
		.logo { font-size: 0.95rem; }
		main { margin: 1.25rem auto 2.5rem; padding: 0 0.75rem; }
	}
</style>
