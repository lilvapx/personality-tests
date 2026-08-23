/**
 * testSession Store (Svelte 5 Runes)
 * Hält den aktuellen Testlauf: Instrument, Locale, Antworten.
 * Antworten leben nur im Memory (kein Persist — bewusst, Datenschutz).
 * Ergebnis wird client-seitig berechnet, nie an einen Server geschickt.
 */
import type { ItemResponse } from '$lib/scoring/types';
import { randomSeed } from '$lib/scoring/shuffle';

export const sessionStore = $state<{
	instrumentId: string | null;
	locale: string;
	responses: ItemResponse[];
	seed: string | null;
}>({
	instrumentId: null,
	locale: 'de',
	responses: [],
	seed: null
});

export function startSession(id: string, loc: string, seed?: string) {
	sessionStore.instrumentId = id;
	sessionStore.locale = loc;
	sessionStore.responses.length = 0;
	sessionStore.seed = seed ?? randomSeed();
}

export function setResponse(itemId: string, value: number) {
	const existing = sessionStore.responses.find(r => r.item_id === itemId);
	if (existing) {
		existing.value = value;
	} else {
		sessionStore.responses.push({ item_id: itemId, value });
	}
}

export function getResponse(itemId: string): number | undefined {
	return sessionStore.responses.find(r => r.item_id === itemId)?.value;
}

export function isComplete(itemCount: number): boolean {
	return sessionStore.responses.length >= itemCount;
}

export function resetSession() {
	sessionStore.responses.length = 0;
	sessionStore.instrumentId = null;
}
