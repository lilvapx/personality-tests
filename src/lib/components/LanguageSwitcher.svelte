<script lang="ts">
	import { currentLocale, setLocale } from '$lib/stores/locale';

	const locales = ['de', 'en', 'lt'];
</script>

<div class="lang-switcher">
	{#each locales as loc}
		<button
			class:active={currentLocale === loc}
			onclick={() => setLocale(loc)}
		>
			{loc.toUpperCase()}
		</button>
	{/each}
</div>

<style>
	.lang-switcher { display: flex; gap: 0.25rem; }
	button {
		padding: 0.3rem 0.6rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: #fff;
		cursor: pointer;
		font-size: 0.8rem;
	}
	button:hover { border-color: #4a90d9; }
	button.active { background: #4a90d9; border-color: #4a90d9; color: #fff; }
</style>
