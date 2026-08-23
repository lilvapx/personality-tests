/**
 * locale Store (Svelte 5 Runes)
 * Aktuelle UI-Sprache. Default: de. Wird im LanguageSwitcher geändert.
 * Persistenz: localStorage (key 'pt-locale') — wird nach dem Mount angewendet,
 * um Hydration-Mismatches zu vermeiden (SSR rendert immer mit Default).
 *
 * Hinweis: Exportiert wird ein State-OBJEKT, dessen Property mutiert wird —
 * das ist das von Svelte 5 erlaubte Muster für Modul-State.
 * (Reassignment von exported $state ist nicht erlaubt.)
 */
export const localeStore = $state({ current: 'de' });

export function setLocale(loc: string) {
	localeStore.current = loc;
	try {
		localStorage.setItem('pt-locale', loc);
	} catch {
		/* localStorage nicht verfügbar (z.B. Privacy-Modus) — dann nur in-memory */
	}
}

/** Gespeicherte Locale nach dem Mount anwenden (kein Hydration-Mismatch) */
export function applySavedLocale() {
	try {
		const saved = localStorage.getItem('pt-locale');
		if (saved === 'de' || saved === 'en' || saved === 'lt') {
			localeStore.current = saved;
		}
	} catch {
		/* ignore */
	}
}
