/**
 * locale Store (Svelte 5 Runes)
 * Aktuelle UI-Sprache. Default: de. Wird im LanguageSwitcher geändert.
 */
export let currentLocale = $state<string>('de');

export function setLocale(loc: string) {
	currentLocale = loc;
}
