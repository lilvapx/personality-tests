/**
 * locale Store (Svelte 5 Runes)
 * Aktuelle UI-Sprache. Default: de. Wird im LanguageSwitcher geändert.
 *
 * Hinweis: Exportiert wird ein State-OBJEKT, dessen Property mutiert wird —
 * das ist das von Svelte 5 erlaubte Muster für Modul-State.
 * (Reassignment von exported $state ist nicht erlaubt.)
 */
export const localeStore = $state({ current: 'de' });

export function setLocale(loc: string) {
	localeStore.current = loc;
}
