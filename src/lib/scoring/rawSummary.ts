/**
 * rawSummary.ts — Erzeugt die Rohdaten-Zusammenfassung für die Copy-Textbox.
 *
 * Format: JSON (strukturiert, KI-freundlich) mit:
 *  - test: Metadaten des Instruments (Name, Version, Skala)
 *  - participant_context: demografische Angaben (werden NICHT erhoben → null)
 *  - results: Domain-Ergebnisse (Summe, Mittelwert, 0-100-Wert, Perzentil)
 *  - items: jede Frage mit Antwort, Dimension, Facette, Reverse-Flag
 */
import type { Item, TestResult } from '$lib/scoring/types';

export interface RawItemEntry {
	id: number; // Item-Nummer (1-basiert, Original-Reihenfolge)
	response: number | null; // Rohantwort auf der Skala
	dimension: string; // Domain-Kurz-ID (E, A, C, N, O)
	facet: string; // Facet-Kurz-ID (z.B. E1)
	reverse_scored: boolean; // true = Item wird umgepolt
}

export interface RawResultEntry {
	name: string; // übersetzter Domain-Name
	raw_score: number | null; // Summe der Item-Antworten
	mean_score: number | null; // Mittelwert (1-5)
	standardized_score: number | null; // 0-100 normiert
	percentile: number | null; // Perzentil (0-100)
}

export interface RawJson {
	test: {
		name: string;
		version: string;
		scale: { min: number; max: number };
	};
	participant_context: {
		age: number | null;
		sex: string | null;
	};
	results: Record<string, RawResultEntry>;
	items: RawItemEntry[];
}

export function buildRawJson(params: {
	result: TestResult;
	items: Item[];
	responses: Array<{ item_id: string; value: number }>;
	name: string;
	version: string;
	scaleMin: number;
	scaleMax: number;
}): RawJson {
	const { result, items, responses, name, version, scaleMin, scaleMax } = params;

	// Antwort-Map: item_id → Wert
	const responseMap = new Map(responses.map(r => [r.item_id, r.value]));

	// Items: Original-Reihenfolge (item_id-Suffix als Nummer)
	const itemsOut: RawItemEntry[] = items
		.map(item => {
			const num = Number(item.item_id.split('-').pop());
			const response = responseMap.get(item.item_id) ?? null;
			return {
				id: Number.isFinite(num) ? num : 0,
				response,
				dimension: item.domain,
				facet: item.facet ?? '',
				reverse_scored: item.keying === 'minus'
			};
		})
		.sort((a, b) => a.id - b.id);

	// Results pro Domain
	const results: Record<string, RawResultEntry> = {};
	for (const domain of result.domains) {
		// Summe der beantworteten Items der Domain
		const domainItems = items.filter(i => i.domain === domain.domain_id);
		const values = domainItems
			.map(i => responseMap.get(i.item_id))
			.filter((v): v is number => v !== undefined);

		const mean = domain.score;
		const rawScore = values.length > 0 ? values.reduce((a, b) => a + b, 0) : null;
		const standardized =
			mean !== null && scaleMax > scaleMin
				? Math.round(((mean - scaleMin) / (scaleMax - scaleMin)) * 1000) / 10
				: null;

		results[domain.domain_id] = {
			name: domain.label_en && domain.label_en !== domain.label ? domain.label_en : domain.label,
			raw_score: rawScore,
			mean_score: mean !== null ? Math.round(mean * 100) / 100 : null,
			standardized_score: standardized,
			percentile: domain.percentile !== null && domain.percentile !== undefined
				? Math.round(domain.percentile)
				: null
		};
	}

	return {
		test: {
			name,
			version,
			scale: { min: scaleMin, max: scaleMax }
		},
		participant_context: {
			age: null,
			sex: null
		},
		results,
		items: itemsOut
	};
}
