<script lang="ts">
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
</script>

<header>
	<a href="/" class="logo">🧠 personality-tests</a>
	<LanguageSwitcher />
</header>

<main>
	<slot />
</main>

<footer>
	<p>Kein klinisches Instrument — nur zur Selbstreflexion.</p>
</footer>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		border-bottom: 1px solid #eee;
	}
	.logo { font-weight: 700; text-decoration: none; color: #222; }
	main { max-width: 720px; margin: 2rem auto; padding: 0 1rem; }
	footer {
		text-align: center;
		padding: 2rem;
		color: #999;
		font-size: 0.8rem;
		border-top: 1px solid #eee;
	}
</style>
