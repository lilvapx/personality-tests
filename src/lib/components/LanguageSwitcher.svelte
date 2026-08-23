<script lang="ts">
	import { localeStore, setLocale } from '$lib/stores/locale.svelte';
	import { uiLocaleName } from '$lib/i18n/ui';

	const locales = [
		{ code: 'de', flag: '🇩🇪', name: 'Deutsch' },
		{ code: 'en', flag: '🇬🇧', name: 'English' },
		{ code: 'lt', flag: '🇱🇹', name: 'Lietuvių' }
	];

	let open = $state(false);

	function toggle() {
		open = !open;
	}

	function choose(loc: string) {
		setLocale(loc);
		open = false;
	}

	const current = $derived(
		locales.find(l => l.code === localeStore.current) ?? locales[0]
	);
</script>

<div class="lang-switcher">
	<button
		class="trigger"
		onclick={toggle}
		aria-haspopup="listbox"
		aria-expanded={open}
		title={uiLocaleName(localeStore.current)}
	>
		<span class="flag">{current.flag}</span>
		<span class="name">{current.name}</span>
		<span class="caret" class:rotated={open}>▾</span>
	</button>

	{#if open}
		<!-- Unsichtbares Overlay: Klick außerhalb schließt das Menü -->
		<div class="backdrop" onclick={() => (open = false)}></div>

		<ul class="menu" role="listbox" aria-label="Sprache wählen">
			{#each locales as loc}
				<li role="option" aria-selected={loc.code === localeStore.current}>
					<button
						class="option"
						class:active={loc.code === localeStore.current}
						onclick={() => choose(loc.code)}
					>
						<span class="flag">{loc.flag}</span>
						<span class="name">{loc.name}</span>
						{#if loc.code === localeStore.current}
							<span class="check">✓</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.lang-switcher {
		position: relative;
	}

	.trigger {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.4rem 0.7rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		background: #fff;
		cursor: pointer;
		font-size: 0.85rem;
		color: #333;
		transition: border-color 0.15s, background 0.15s;
	}
	.trigger:hover { border-color: #4a90d9; background: #f5f9ff; }
	.flag { font-size: 1rem; line-height: 1; }
	.name { font-weight: 500; }
	.caret { font-size: 0.7rem; color: #888; transition: transform 0.15s; }
	.caret.rotated { transform: rotate(180deg); }

	/* Unsichtbares Overlay, damit Klick außerhalb das Menü schließt */
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 40;
	}

	.menu {
		position: absolute;
		top: calc(100% + 0.4rem);
		right: 0;
		z-index: 50;
		min-width: 180px;
		list-style: none;
		margin: 0;
		padding: 0.35rem;
		background: #fff;
		border: 1px solid #e2e2e2;
		border-radius: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
	}

	.option {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		width: 100%;
		padding: 0.5rem 0.6rem;
		border: none;
		border-radius: 6px;
		background: transparent;
		cursor: pointer;
		font-size: 0.9rem;
		color: #333;
		text-align: left;
	}
	.option:hover { background: #f0f5fc; }
	.option.active { background: #e8f0fe; font-weight: 600; color: #1a56db; }
	.check { margin-left: auto; color: #1a56db; font-weight: 700; }
</style>
