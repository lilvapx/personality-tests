/**
 * results Store (Svelte 5 Runes)
 * Hält das letzte Testergebnis im Memory (für die Result-Seite).
 * Nicht persistiert — bei Reload weg, gewollt (Datenschutz).
 */
import type { TestResult } from '$lib/scoring/types';

export let currentResult = $state<TestResult | null>(null);

export function setResult(result: TestResult) {
	currentResult = result;
}

export function clearResult() {
	currentResult = null;
}
