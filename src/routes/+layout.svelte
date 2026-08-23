<script lang="ts">
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { t } from '$lib/i18n/ui';
	import { localeStore, applySavedLocale } from '$lib/stores/locale.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		applySavedLocale();
	});
</script>

<svelte:head>
	<html lang={localeStore.current} />
</svelte:head>

<header>
	<a href="/" class="logo">{t('nav.logo')}</a>
	<LanguageSwitcher />
</header>

<main>
	<slot />
</main>

<footer>
	<p class="footer-note">{t('footer.note')}</p>
	<nav class="footer-links">
		<a href="/impressum">{t('footer.impressum')}</a>
		<span class="sep">·</span>
		<a href="/datenschutz">{t('footer.datenschutz')}</a>
	</nav>
</footer>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.85rem 1.5rem;
		border-bottom: 1px solid #eee;
	}
	.logo { font-weight: 700; text-decoration: none; color: #222; }
	main { max-width: 820px; margin: 1.5rem auto; padding: 0 1rem; min-height: 60vh; }
	footer {
		text-align: center;
		padding: 1.5rem 1rem;
		color: #999;
		font-size: 0.8rem;
		border-top: 1px solid #eee;
	}
	.footer-note { margin: 0 0 0.5rem; }
	.footer-links { display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap; }
	.footer-links a { color: #666; text-decoration: none; padding: 0.25rem 0.5rem; }
	.footer-links a:hover { color: #4a90d9; text-decoration: underline; }
	.sep { color: #ccc; }

	/* Mobile: kompakter Header, mehr Nutzfläche */
	@media (max-width: 640px) {
		header { padding: 0.6rem 0.75rem; }
		.logo { font-size: 0.95rem; }
		main { margin: 1rem auto; padding: 0 0.75rem; }
		footer { padding: 1.25rem 0.75rem; }
	}
</style>
