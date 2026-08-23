import { describe, it, expect } from 'vitest';
import { buildRawJson } from '$lib/scoring/rawSummary';
import type { Item, TestResult } from '$lib/scoring/types';

const items: Item[] = [
	{ item_id: 'ipip-neo-120-001', domain: 'E', facet: 'E1', keying: 'plus' },
	{ item_id: 'ipip-neo-120-002', domain: 'E', facet: 'E1', keying: 'minus' },
	{ item_id: 'ipip-neo-120-003', domain: 'A', facet: 'A1', keying: 'plus' },
	{ item_id: 'ipip-neo-120-010', domain: 'N', facet: 'N1', keying: 'minus' }
];

const responses = [
	{ item_id: 'ipip-neo-120-001', value: 5 },
	{ item_id: 'ipip-neo-120-002', value: 2 },
	{ item_id: 'ipip-neo-120-003', value: 4 },
	{ item_id: 'ipip-neo-120-010', value: 1 }
];

const result: TestResult = {
	instrument_id: 'ipip-neo-120',
	locale: 'de',
	completed_at: '2026-08-23T12:00:00.000Z',
	domains: [
		{
			domain_id: 'E',
			label: 'Extraversion',
			label_en: 'Extraversion',
			score: 3.5,
			percentile: 62,
			facets: []
		},
		{
			domain_id: 'A',
			label: 'Verträglichkeit',
			label_en: 'Agreeableness',
			score: 4.0,
			percentile: 81,
			facets: []
		},
		{
			domain_id: 'N',
			label: 'Neurotizismus',
			label_en: 'Neuroticism',
			score: 1.0,
			percentile: 5,
			facets: []
		}
	]
};

const base = {
	result,
	items,
	responses,
	name: 'IPIP-NEO-120',
	version: '1.0.0',
	scaleMin: 1,
	scaleMax: 5
};

describe('buildRawJson', () => {
	it('erzeugt test-Metadaten mit Name, Version, Skala', () => {
		const json = buildRawJson(base);
		expect(json.test.name).toBe('IPIP-NEO-120');
		expect(json.test.version).toBe('1.0.0');
		expect(json.test.scale).toEqual({ min: 1, max: 5 });
	});

	it('participant_context ist null (keine Erhebung)', () => {
		const json = buildRawJson(base);
		expect(json.participant_context).toEqual({ age: null, sex: null });
	});

	it('enthält alle Items mit Antwort, Dimension, Facette, Reverse-Flag', () => {
		const json = buildRawJson(base);
		expect(json.items).toHaveLength(4);
		// sortiert nach ID
		expect(json.items[0]).toEqual({ id: 1, response: 5, dimension: 'E', facet: 'E1', reverse_scored: false });
		expect(json.items[1]).toEqual({ id: 2, response: 2, dimension: 'E', facet: 'E1', reverse_scored: true });
		expect(json.items[3]).toEqual({ id: 10, response: 1, dimension: 'N', facet: 'N1', reverse_scored: true });
	});

	it('results: raw_score = Summe, mean_score = Mittelwert, percentile', () => {
		const json = buildRawJson(base);
		expect(json.results['E']).toMatchObject({
			raw_score: 7, // 5 + 2
			mean_score: 3.5,
			standardized_score: 62.5, // ((3.5-1)/4)*100
			percentile: 62
		});
		expect(json.results['A']).toMatchObject({
			raw_score: 4,
			mean_score: 4,
			percentile: 81
		});
	});

	it('nutzt englischen Namen wenn übersetzt abweicht', () => {
		const json = buildRawJson(base);
		expect(json.results['A'].name).toBe('Agreeableness');
		expect(json.results['E'].name).toBe('Extraversion');
	});
});
