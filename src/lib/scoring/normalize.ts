/**
 * Normalisierung: Rohwert → Prozentrang, falls Normdaten vorhanden.
 *
 * Normformat (norms/*.json):
 *   { domains: { E: { mean, sd, n } }, facets: { E1: { mean, sd, n } } }
 *
 * Annahme: Normalverteilung. Prozentrang = Φ((x - mean) / sd) * 100.
 * Ohne Normdaten (mean/sd null) → null zurückgeben.
 */
export function toPercentile(score: number, mean: number | null, sd: number | null): number | null {
	if (mean === null || sd === null || sd <= 0) return null;
	const z = (score - mean) / sd;
	// Approximation der Normalverteilungs-CDF (Abramowitz & Stegun 26.2.17)
	const t = 1 / (1 + 0.2316419 * Math.abs(z));
	const d = 0.3989422804014327 * Math.exp(-z * z / 2);
	const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
	const cdf = 0.5 + (z >= 0 ? 1 - p : p - 1) * 0 + (z >= 0 ? 1 - p : p);
	// Korrektur: cdf = 0.5 + sign(z) * (0.5 - (0.5 - p_neg)) — präziser:
	const phi = z >= 0 ? 1 - 0.5 * (1 + erf(z / Math.SQRT2)) : 0.5 * (1 + erf(z / Math.SQRT2));
	return Math.round(phi * 1000) / 10;
}

// Hilfsfunktion (Approximation via Polynom, numerisch stabil)
function erf(x: number): number {
	// Abramowitz & Stegun 7.1.26
	const sign = x < 0 ? -1 : 1;
	const ax = Math.abs(x);
	const t = 1 / (1 + 0.3275911 * ax);
	const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-ax * ax);
	return sign * y;
}
