/**
 * percentile.ts
 * Berechnet Perzentile aus Normdaten unter Normalverteilungsannahme.
 *
 * Formel: z = (score - mean) / sd → Perzentil = Φ(z) * 100
 * Φ = kumulative Standardnormalverteilung (Abramowitz & Stegun 7.1.26 Näherung).
 */
import type { NormData } from './types';

/**
 * Kumulative Verteilungsfunktion der Standardnormalverteilung.
 * Fehler < 1e-8, gut genug für Perzentile.
 */
export function normalCdf(z: number): number {
	// Abramowitz & Stegun 7.1.26
	const t = 1 / (1 + 0.2316419 * Math.abs(z));
	const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
	const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
	return z > 0 ? 1 - p : p;
}

/**
 * Perzentil eines Scores (0-100) anhand der Facet-Norm.
 * @param score Rohwert (Mittelwert-Skala 1-5)
 * @param norm Norm-Objekt der Facette { mean, sd }
 * @returns Perzentil 0-100, oder null wenn norm fehlt
 */
export function percentileFromNorm(score: number, norm: { mean: number; sd: number } | undefined): number | null {
	if (!norm || norm.sd <= 0) return null;
	const z = (score - norm.mean) / norm.sd;
	return Math.round(normalCdf(z) * 1000) / 10; // 1 Dezimalstelle
}

/**
 * Wendet Normdaten auf ein Testergebnis an: berechnet Perzentile für
 * alle Facetten und Domains (Domain-Perzentil = Mittelwert der Facet-Perzentile).
 * Mutiert die Ergebnis-Struktur nicht, sondern liefert eine neue zurück.
 */
export function applyNorms<T extends { domains: Array<{ domain_id: string; score: number | null; facets: Array<{ facet_id: string; score: number | null }> }> }>(
	result: T,
	norms: NormData | null
): T {
	if (!norms) return result;
	const facetNorms = norms.facets;

	const domains = result.domains.map(domain => {
		// Facet-Perzentile
		const facets = domain.facets.map(facet => {
			let percentile: number | null = null;
			if (facet.score !== null) {
				const norm = facetNorms[facet.facet_id];
				percentile = percentileFromNorm(facet.score, norm);
			}
			return { ...facet, percentile };
		});

		// Domain-Perzentil = Mittelwert der vorhandenen Facet-Perzentile
		const pcts = facets.map(f => f.percentile).filter((p): p is number => p !== null);
		const percentile = pcts.length > 0 ? Math.round((pcts.reduce((a, b) => a + b, 0) / pcts.length) * 10) / 10 : null;

		return { ...domain, facets, percentile };
	});

	return { ...result, domains };
}
