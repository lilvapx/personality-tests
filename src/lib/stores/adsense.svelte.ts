/**
 * adsense.svelte.ts
 * Lädt Google AdSense NUR nach Einwilligung (Consent für Werbung).
 *
 * - AdSense-Script wird erst bei consent.ads === true geladen.
 * - Bei Consent-Änderung (Widerruf) wird das Script entfernt.
 * - Personalisierte Werbung wird über die Google-Zustimmung gesteuert
 *   (adsbygoogle = window.adsbygoogle || []).push({});
 */
import { browser } from '$app/environment';
import { consentStore } from './consent.svelte';

// TODO: Echte Publisher-ID eintragen (ca-pub-XXXXXXXXXXXXXXXX)
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX';
const SCRIPT_ID = 'pt-adsense';

let scriptLoaded = false;

function loadScript() {
	if (!browser || scriptLoaded) return;
	const existing = document.getElementById(SCRIPT_ID);
	if (existing) return;
	const s = document.createElement('script');
	s.id = SCRIPT_ID;
	s.async = true;
	s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
	s.crossOrigin = 'anonymous';
	document.head.appendChild(s);
	scriptLoaded = true;
}

function removeScript() {
	if (!browser) return;
	const el = document.getElementById(SCRIPT_ID);
	if (el) el.remove();
	scriptLoaded = false;
}

/** Beim Seitenstart aufrufen: reagiert auf Consent-Status */
export function initAdsense() {
	if (!browser) return;
	if (consentStore.state?.ads) {
		loadScript();
	} else {
		removeScript();
	}
	window.addEventListener('pt-consent-change', () => {
		if (consentStore.state?.ads) loadScript();
		else removeScript();
	});
}
