/**
 * importResult.ts
 * Importiert ein gespeichertes Testergebnis-JSON und stellt es im Store wieder her.
 *
 * Unterstützte Formate:
 *  1. Export-Format (neu, mit Responses): { result: TestResult, responses: ItemResponse[] }
 *  2. Reines TestResult (altes Export-Format): TestResult direkt
 *
 * Client-seitig, kein Server — Datenschutz bleibt gewahrt.
 */
import type { TestResult, ItemResponse } from '$lib/scoring/types';

export interface ImportResult {
	result: TestResult;
	responses: ItemResponse[];
}

function isRecord(v: unknown): v is Record<string, unknown> {
	return typeof v === 'object' && v !== null;
}

function isValidTestResult(v: unknown): v is TestResult {
	if (!isRecord(v)) return false;
	if (typeof v.instrument_id !== 'string') return false;
	if (typeof v.locale !== 'string') return false;
	if (typeof v.completed_at !== 'string') return false;
	if (!Array.isArray(v.domains)) return false;
	// Jede Domain braucht domain_id + facets
	return v.domains.every(d =>
		isRecord(d) &&
		typeof d.domain_id === 'string' &&
		Array.isArray(d.facets)
	);
}

function parseResponses(v: unknown): ItemResponse[] {
	if (!Array.isArray(v)) return [];
	return v.filter((r): r is ItemResponse =>
		isRecord(r) && typeof r.item_id === 'string' && typeof r.value === 'number'
	);
}

/**
 * Parst importierten JSON-Text. Wirft Error bei ungültigem Format.
 */
export function parseImportedResult(jsonText: string): ImportResult {
	let data: unknown;
	try {
		data = JSON.parse(jsonText);
	} catch {
		throw new Error('INVALID_JSON');
	}

	if (!isRecord(data)) throw new Error('NOT_A_RESULT');

	// Format 1: { result: TestResult, responses: [...] }
	if (isRecord(data.result) && isValidTestResult(data.result)) {
		return {
			result: data.result,
			responses: parseResponses(data.responses)
		};
	}

	// Format 2: reines TestResult
	if (isValidTestResult(data)) {
		return { result: data, responses: [] };
	}

	throw new Error('NOT_A_RESULT');
}
