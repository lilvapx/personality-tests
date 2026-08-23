import { describe, it, expect } from 'vitest';
import { normalCdf, percentileFromNorm, applyNorms } from '$lib/scoring/percentile';
import type { NormData } from '$lib/scoring/types';

describe('percentile', () => {
	it('normalCdf: bekannte Werte', () => {
		expect(normalCdf(0)).toBeCloseTo(0.5, 5);
		expect(normalCdf(1.96)).toBeCloseTo(0.975, 2);
		expect(normalCdf(-1.96)).toBeCloseTo(0.025, 2);
		expect(normalCdf(0)).toBeCloseTo(0.5, 5);
	});

	it('percentileFromNorm: Score = Mean → 50. Perzentil', () => {
		const p = percentileFromNorm(2.5, { mean: 2.5, sd: 0.5 });
		expect(p).toBeCloseTo(50, 1);
	});

	it('percentileFromNorm: Score = Mean + 1SD → ~84. Perzentil', () => {
		const p = percentileFromNorm(3.0, { mean: 2.5, sd: 0.5 });
		expect(p).toBeGreaterThan(83);
		expect(p).toBeLessThan(85);
	});

	it('percentileFromNorm: Score = Mean - 1SD → ~16. Perzentil', () => {
		const p = percentileFromNorm(2.0, { mean: 2.5, sd: 0.5 });
		expect(p).toBeGreaterThan(15);
		expect(p).toBeLessThan(17);
	});

	it('percentileFromNorm: fehlende Norm → null', () => {
		expect(percentileFromNorm(2.5, undefined)).toBeNull();
		expect(percentileFromNorm(2.5, { mean: 2.5, sd: 0 })).toBeNull();
	});

	it('applyNorms: setzt Facet- und Domain-Perzentile', () => {
		const norms: NormData = {
			instrument_id: 'test',
			source: 'test',
			scale: 'mean-1-5',
			facets: {
				N1: { mean: 2.2, sd: 0.8 },
				N2: { mean: 2.3, sd: 0.7 }
			}
		};
		const result = {
			domains: [{
				domain_id: 'N',
				label: 'Neuroticism',
				score: 2.2,
				percentile: null,
				facets: [
					{ facet_id: 'N1', label: 'Anxiety', score: 2.2, items_answered: 10, items_total: 10, percentile: null },
					{ facet_id: 'N2', label: 'Anger', score: 2.3, items_answered: 10, items_total: 10, percentile: null }
				]
			}]
		};
		const withNorms = applyNorms(result, norms);
		expect(withNorms.domains[0].facets[0].percentile).toBeCloseTo(50, 0);
		expect(withNorms.domains[0].facets[1].percentile).toBeCloseTo(50, 0);
		expect(withNorms.domains[0].percentile).toBeCloseTo(50, 0);
	});

	it('applyNorms: null-Normen → Perzentile null', () => {
		const result = {
			domains: [{
				domain_id: 'N',
				label: 'Neuroticism',
				score: null,
				percentile: null,
				facets: [
					{ facet_id: 'N1', label: 'Anxiety', score: null, items_answered: 0, items_total: 10, percentile: null }
				]
			}]
		};
		const withNorms = applyNorms(result, null);
		expect(withNorms.domains[0].percentile).toBeNull();
		expect(withNorms.domains[0].facets[0].percentile).toBeNull();
	});
});
