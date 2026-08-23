/**
 * consent.svelte.ts
 * Einwilligungs-Management (DSGVO Art. 6 Abs. 1 lit. a, TTDSG § 25).
 *
 * - Nur notwendige Speicherungen (Sprache, Consent selbst) sind immer aktiv.
 * - Werbung (Google AdSense) wird erst nach Einwilligung aktiviert.
 * - Einwilligung wird mit Zeitstempel im localStorage dokumentiert.
 */
import { browser } from '$app/environment';

export interface ConsentState {
	necessary: true; // immer aktiv
	ads: boolean; // personalisierte Werbung (AdSense)
	version: number;
	updatedAt: string;
}

const KEY = 'pt-consent';
const VERSION = 1;

function load(): ConsentState | null {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as ConsentState;
		if (parsed.version !== VERSION) return null; // Consent-Version geändert → neu fragen
		return parsed;
	} catch {
		return null;
	}
}

function save(state: ConsentState) {
	if (!browser) return;
	localStorage.setItem(KEY, JSON.stringify(state));
}

export const consentStore = $state<{
	state: ConsentState | null;
	showBanner: boolean;
	showSettings: boolean;
}>({
	state: null,
	showBanner: false,
	showSettings: false
});

/** Beim Seitenstart: gespeicherten Consent laden, sonst Banner zeigen */
export function initConsent() {
	if (!browser) return;
	const loaded = load();
	if (loaded) {
		consentStore.state = loaded;
		consentStore.showBanner = false;
	} else {
		consentStore.showBanner = true;
	}
}

/** Signal für externe Script-Loader (z.B. AdSense): Consent hat sich geändert */
function broadcast() {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent('pt-consent-change', { detail: consentStore.state }));
	}
}

export function acceptAll() {
	const state: ConsentState = {
		necessary: true,
		ads: true,
		version: VERSION,
		updatedAt: new Date().toISOString()
	};
	save(state);
	consentStore.state = state;
	consentStore.showBanner = false;
	consentStore.showSettings = false;
	broadcast();
}

export function acceptNecessary() {
	const state: ConsentState = {
		necessary: true,
		ads: false,
		version: VERSION,
		updatedAt: new Date().toISOString()
	};
	save(state);
	consentStore.state = state;
	consentStore.showBanner = false;
	consentStore.showSettings = false;
	broadcast();
}

/** Aus den Einstellungen speichern (nur Werbung schaltbar) */
export function saveSettings(ads: boolean) {
	const state: ConsentState = {
		necessary: true,
		ads,
		version: VERSION,
		updatedAt: new Date().toISOString()
	};
	save(state);
	consentStore.state = state;
	consentStore.showBanner = false;
	consentStore.showSettings = false;
	broadcast();
}
