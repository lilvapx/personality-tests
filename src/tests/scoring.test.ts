import { describe, it, expect } from 'vitest';
import { reverseKey, inScale } from '$lib/scoring/reverseKey';
import { computeFacetScore } from '$lib/scoring/computeFacetScore';
import { computeDomainScore } from '$lib/scoring/computeDomainScore';
import { scoreTest } from '$lib/scoring';
import type { Item, ScoringConfig, ItemResponse } from '$lib/scoring/types';

describe('reverseKey', () => {
	it('polt Likert 1-5 korrekt um', () => {
		expect(reverseKey(1, 1, 5)).toBe(5);
		expect(reverseKey(2, 1, 5)).toBe(4);
		expect(reverseKey(3, 1, 5)).toBe(3);
		expect(reverseKey(5, 1, 5)).toBe(1);
	});

	it('wirft bei Werten außerhalb der Skala', () => {
		expect(() => reverseKey(0, 1, 5)).toThrow();
		expect(() => reverseKey(6, 1, 5)).toThrow();
	});

	it('inScale erkennt gültige Werte', () => {
		expect(inScale(3, 1, 5)).toBe(true);
		expect(inScale(0, 1, 5)).toBe(false);
		expect(inScale(Number.NaN, 1, 5)).toBe(false);
	});
});

describe('computeFacetScore', () => {
	const items: Item[] = [
		{ item_id: 'i1', domain: 'E', facet: 'E1', keying: 'plus' },
		{ item_id: 'i2', domain: 'E', facet: 'E1', keying: 'plus' },
		{ item_id: 'i3', domain: 'E', facet: 'E1', keying: 'minus' },
		{ item_id: 'i4', domain: 'E', facet: 'E1', keying: 'minus' }
	];
	const scoring: ScoringConfig = {
		instrument_id: 'test',
		facets: { E1: { domain: 'E', items: ['i1', 'i2', 'i3', 'i4'] } }
	};

	it('berechnet Mittelwert mit Reversing', () => {
		const responses = new Map([
			['i1', 5], ['i2', 4], ['i3', 1], ['i4', 2]
		]);
		// plus: 5, 4 → reversed minus: 1→5, 2→4 → (5+4+5+4)/4 = 4.5
		const result = computeFacetScore('E1', items, responses, scoring, 1, 5);
		expect(result.score).toBe(4.5);
		expect(result.items_answered).toBe(4);
	});

	it('gibt null bei zu wenigen Antworten (<75%)', () => {
		const responses = new Map([['i1', 5]]);
		const result = computeFacetScore('E1', items, responses, scoring, 1, 5);
		expect(result.score).toBeNull();
		expect(result.items_answered).toBe(1);
	});
});

describe('computeDomainScore', () => {
	it('mittelt Facet-Scores und überspringt null', () => {
		const domain = computeDomainScore('E', 'Extraversion', [
			{ facet_id: 'E1', label: 'E1', domain_id: 'E', score: 4, items_answered: 4, items_total: 4 },
			{ facet_id: 'E2', label: 'E2', domain_id: 'E', score: 2, items_answered: 4, items_total: 4 },
			{ facet_id: 'E3', label: 'E3', domain_id: 'E', score: null, items_answered: 1, items_total: 4 },
			{ facet_id: 'E4', label: 'E4', domain_id: 'E', score: 3, items_answered: 4, items_total: 4 },
			{ facet_id: 'E5', label: 'E5', domain_id: 'E', score: 5, items_answered: 4, items_total: 4 },
			{ facet_id: 'E6', label: 'E6', domain_id: 'E', score: 1, items_answered: 4, items_total: 4 }
		]);
		// (4+2+3+5+1)/5 = 3.0
		expect(domain.score).toBe(3);
		expect(domain.facets.length).toBe(6);
	});

	it('gibt null, wenn zu wenige Facets gültig sind', () => {
		const domain = computeDomainScore('N', 'Neuroticism', [
			{ facet_id: 'N1', label: 'N1', domain_id: 'N', score: 4, items_answered: 4, items_total: 4 },
			{ facet_id: 'N2', label: 'N2', domain_id: 'N', score: null, items_answered: 0, items_total: 4 },
			{ facet_id: 'N3', label: 'N3', domain_id: 'N', score: null, items_answered: 0, items_total: 4 },
			{ facet_id: 'N4', label: 'N4', domain_id: 'N', score: null, items_answered: 0, items_total: 4 },
			{ facet_id: 'N5', label: 'N5', domain_id: 'N', score: null, items_answered: 0, items_total: 4 },
			{ facet_id: 'N6', label: 'N6', domain_id: 'N', score: null, items_answered: 0, items_total: 4 }
		]);
		expect(domain.score).toBeNull();
	});
});

describe('scoreTest (Integration)', () => {
	it('verarbeitet einen kompletten Lauf', () => {
		const items: Item[] = [
			{ item_id: 'i1', domain: 'E', facet: 'E1', keying: 'plus' },
			{ item_id: 'i2', domain: 'E', facet: 'E1', keying: 'plus' },
			{ item_id: 'i3', domain: 'E', facet: 'E1', keying: 'minus' },
			{ item_id: 'i4', domain: 'E', facet: 'E1', keying: 'minus' }
		];
		const scoring: ScoringConfig = {
			instrument_id: 'test',
			facets: { E1: { domain: 'E', items: ['i1', 'i2', 'i3', 'i4'] } }
		};
		const responses: ItemResponse[] = [
			{ item_id: 'i1', value: 5 },
			{ item_id: 'i2', value: 5 },
			{ item_id: 'i3', value: 1 },
			{ item_id: 'i4', value: 1 }
		];

		const result = scoreTest({
			instrumentId: 'test',
			locale: 'de',
			items,
			domains: [{ id: 'E', label: 'Extraversion', facets: [{ id: 'E1', label: 'Friendliness' }] }],
			scoring,
			responses,
			min: 1,
			max: 5
		});

		expect(result.domains).toHaveLength(1);
		expect(result.domains[0].score).toBe(5); // alles plus 5 → 5
		expect(result.instrument_id).toBe('test');
		expect(result.completed_at).toBeTruthy();
	});
});
