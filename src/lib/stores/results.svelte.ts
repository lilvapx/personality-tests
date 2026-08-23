/**
 * results Store (Svelte 5 Runes)
 * Hält das letzte Testergebnis im Memory (für die Result-Seite).
 * Nicht persistiert — bei Reload weg, gewollt (Datenschutz).
 */
import type { TestResult } from '$lib/scoring/types';

export const resultStore = $state<{ result: TestResult | null }>({ result: null });

export function setResult(result: TestResult) {
	resultStore.result = result;
}

export function clearResult() {
	resultStore.result = null;
}
