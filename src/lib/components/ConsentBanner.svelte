<script lang="ts">
	import { consentStore, acceptAll, acceptNecessary, saveSettings } from '$lib/stores/consent.svelte';
	import { t } from '$lib/i18n/ui';

	let adsToggle = $state(true);
</script>

<!-- Banner (nur wenn noch kein Consent) -->
{#if consentStore.showBanner && !consentStore.state}
	<div class="banner" role="dialog" aria-label="Cookie-Einwilligung">
		<div class="banner-inner">
			<p class="banner-text">
				{@html t('consent.text', { strong: '<strong>', '/strong': '</strong>' })}
			</p>
			<div class="banner-actions">
				<button class="btn primary" onclick={acceptAll}>{t('consent.acceptAll')}</button>
				<button class="btn" onclick={acceptNecessary}>{t('consent.necessaryOnly')}</button>
				<button class="btn link" onclick={() => (consentStore.showSettings = true)}>{t('consent.settings')}</button>
			</div>
		</div>
	</div>
{/if}

<!-- Einstellungen-Modal -->
{#if consentStore.showSettings}
	<div
		class="modal-backdrop"
		role="presentation"
		onclick={() => (consentStore.showSettings = false)}
		onkeydown={(e) => e.key === 'Escape' && (consentStore.showSettings = false)}
	>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-label="Cookie-Einstellungen"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
		>
			<h3>{t('consent.settingsTitle')}</h3>

			<div class="setting">
				<div class="setting-head">
					<span class="setting-name">{t('consent.necessary')}</span>
					<span class="setting-state on">✓</span>
				</div>
				<p class="setting-desc">{@html t('consent.necessaryDesc', { strong: '<strong>', '/strong': '</strong>' })}</p>
			</div>

			<div class="setting">
				<div class="setting-head">
					<label for="ads-toggle" class="setting-name">{t('consent.ads')}</label>
					<input
						id="ads-toggle"
						type="checkbox"
						checked={adsToggle}
						onchange={(e) => (adsToggle = e.currentTarget.checked)}
					/>
				</div>
				<p class="setting-desc">{@html t('consent.adsDesc', { strong: '<strong>', '/strong': '</strong>' })}</p>
			</div>

			<div class="modal-actions">
				<button class="btn" onclick={() => saveSettings(adsToggle)}>{t('consent.save')}</button>
			</div>

			<p class="modal-note">
				<a href="/datenschutz" onclick={() => (consentStore.showSettings = false)}>{t('consent.privacyLink')}</a>
			</p>
		</div>
	</div>
{/if}

<style>
	.banner {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: #fff;
		border-top: 1px solid var(--card-border);
		box-shadow: 0 -4px 24px rgba(30, 36, 51, 0.12);
		padding: 1rem;
	}
	.banner-inner {
		max-width: 820px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.banner-text { margin: 0; font-size: 0.9rem; color: var(--text-secondary); }
	.banner-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }

	.btn {
		padding: 0.6rem 1.1rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--card-border);
		background: #fff;
		color: var(--text);
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		min-height: 44px;
	}
	.btn.primary {
		background: linear-gradient(120deg, var(--brand-500), var(--accent));
		border-color: transparent;
		color: #fff;
	}
	.btn.link { background: transparent; border-color: transparent; color: var(--brand-600); }

	/* Modal */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 110;
		background: rgba(30, 36, 51, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}
	.modal {
		background: #fff;
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		max-width: 480px;
		width: 100%;
		box-shadow: var(--shadow-lg);
	}
	.modal h3 { margin-top: 0; }
	.setting { padding: 0.75rem 0; border-bottom: 1px solid var(--card-border); }
	.setting:last-of-type { border-bottom: none; }
	.setting-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
	.setting-name { font-weight: 700; font-size: 0.95rem; }
	.setting-state.on { color: #16a34a; font-weight: 700; }
	.setting-desc { margin: 0.35rem 0 0; font-size: 0.85rem; color: var(--text-secondary); }
	input[type='checkbox'] { width: 1.3rem; height: 1.3rem; accent-color: var(--brand-600); }
	.modal-actions { margin-top: 1rem; }
	.modal-note { margin: 0.75rem 0 0; font-size: 0.8rem; }
</style>
