/**
 * rawSummary.ts — Erzeugt eine kompakte, AI-freundliche Text-Zusammenfassung
 * der Testergebnisse (Rohdaten) für die Copy-Textbox.
 *
 * Format-Ziel: kurz, strukturiert, ohne überflüssige Zeichen — damit ein
 * LLM (ChatGPT & Co.) die Daten schnell und fehlerfrei parsen kann.
 */
import type { TestResult } from '$lib/scoring/types';

/**
 * Kompakte Text-Repräsentation eines Testergebnisses.
 *
 * Beispiel:
 *   Big Five (IPIP-NEO-120), Deutsch, 2026-08-23
 *   E (Extraversion): 3.42 (62%) | A (Agreeableness): 4.10 (81%) | ...
 *
 * Facetten werden pro Domain in Klammern mitgegeben:
 *   E (Extraversion) 3.42 [E1 3.2, E2 4.0, ...]
 */
export function buildRawSummary(result: TestResult, instrumentName?: string): string {
	const lines: string[] = [];

	// Kopfzeile
	const name = instrumentName ?? result.instrument_id;
	const date = new Date(result.completed_at).toISOString().slice(0, 10);
	lines.push(`${name} (${result.instrument_id}), ${result.locale}, ${date}`);

	// Pro Domain eine Zeile
	for (const domain of result.domains) {
		const score = domain.score !== null ? domain.score.toFixed(2) : '–';
		const pct = domain.percentile !== null && domain.percentile !== undefined
			? `${Math.round(domain.percentile)}%`
			: '–';

		// Facetten kompakt: "E1 3.2, E2 4.0, ..."
		const facetParts = domain.facets
			.map((f) => {
				const fs = f.score !== null ? f.score.toFixed(2) : '–';
				const fp = f.percentile !== null && f.percentile !== undefined
					? `${Math.round(f.percentile)}%`
					: '';
				return `${f.facet_id} ${fs}${fp ? ` (${fp})` : ''}`;
			})
			.join(', ');

		const label = domain.label_en && domain.label_en !== domain.label
			? `${domain.label} (${domain.label_en})`
			: domain.label;

		lines.push(`${domain.domain_id} ${label}: ${score} (${pct}) [${facetParts}]`);
	}

	return lines.join('\n');
}
