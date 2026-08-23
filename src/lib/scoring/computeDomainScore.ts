import type { DomainResult, FacetResult } from './types';

/**
 * Aggregiert Facet-Scores zu Domain-Scores.
 * Domain-Score = Mittelwert der Facet-Scores (nicht der Items direkt).
 * Fehlende Facets (null) werden übersprungen; Domain braucht mind. 4 von 6 Facets.
 */
export function computeDomainScore(
	domainId: string,
	domainLabel: string,
	facets: FacetResult[],
	translatedLabel: string | null = null,
	minFacets = 4
): DomainResult {
	const valid = facets.filter(f => f.score !== null);
	const total = facets.length;

	let score: number | null = null;
	if (valid.length >= Math.min(minFacets, total) && valid.length > 0) {
		score = valid.reduce((acc, f) => acc + (f.score as number), 0) / valid.length;
	}

	return {
		domain_id: domainId,
		label: translatedLabel ?? domainLabel,
		label_en: domainLabel,
		score,
		facets
	};
}
