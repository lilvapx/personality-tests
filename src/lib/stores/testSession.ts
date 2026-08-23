/**
 * testSession Store (Svelte 5 Runes)
 * Hält den aktuellen Testlauf: Instrument, Locale, Antworten.
 * Antworten leben nur im Memory (kein Persist — bewusst, Datenschutz).
 * Ergebnis wird client-seitig berechnet, nie an einen Server geschickt.
 */
import type { ItemResponse } from '$lib/scoring/types';

export let instrumentId = $state<string | null>(null);
export let locale = $state<string>('de');
export let responses = $state<ItemResponse[]>([]);

export function startSession(id: string, loc: string) {
	instrumentId = id;
	locale = loc;
	responses.length = 0;
}

export function setResponse(itemId: string, value: number) {
	const existing = responses.find(r => r.item_id === itemId);
	if (existing) {
		existing.value = value;
	} else {
		responses.push({ item_id: itemId, value });
	}
}

export function getResponse(itemId: string): number | undefined {
	return responses.find(r => r.item_id === itemId)?.value;
}

export function isComplete(itemCount: number): boolean {
	return responses.length >= itemCount;
}

export function resetSession() {
	responses.length = 0;
	instrumentId = null;
}
