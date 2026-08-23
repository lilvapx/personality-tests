import { describe, it, expect } from 'vitest';
import { parseImportedResult } from '$lib/export/importResult';

const validResult = {
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
			facets: [
				{ facet_id: 'E1', label: 'Freundlichkeit', label_en: 'Friendliness', domain_id: 'E', score: 3.2, items_answered: 10, items_total: 10, percentile: 55 }
			]
		}
	]
};

describe('parseImportedResult', () => {
	it('parst das neue Export-Format { result, responses }', () => {
		const data = {
			result: validResult,
			responses: [
				{ item_id: 'ipip-neo-120-001', value: 5 },
				{ item_id: 'ipip-neo-120-002', value: 2 }
			]
		};
		const imported = parseImportedResult(JSON.stringify(data));
		expect(imported.result.instrument_id).toBe('ipip-neo-120');
		expect(imported.responses).toHaveLength(2);
		expect(imported.responses[0]).toEqual({ item_id: 'ipip-neo-120-001', value: 5 });
	});

	it('parst das alte Format (reines TestResult)', () => {
		const imported = parseImportedResult(JSON.stringify(validResult));
		expect(imported.result.instrument_id).toBe('ipip-neo-120');
		expect(imported.responses).toEqual([]);
	});

	it('wirft INVALID_JSON bei kaputtem JSON', () => {
		expect(() => parseImportedResult('{ kein json')).toThrow('INVALID_JSON');
	});

	it('wirft NOT_A_RESULT bei fehlender Struktur', () => {
		expect(() => parseImportedResult(JSON.stringify({ foo: 'bar' }))).toThrow('NOT_A_RESULT');
	});

	it('wirft NOT_A_RESULT bei null', () => {
		expect(() => parseImportedResult('null')).toThrow('NOT_A_RESULT');
	});

	it('filtert ungültige Responses', () => {
		const data = {
			result: validResult,
			responses: [
				{ item_id: 'ipip-neo-120-001', value: 5 },
				{ item_id: 'kaputt' },
				'not-an-object'
			]
		};
		const imported = parseImportedResult(JSON.stringify(data));
		expect(imported.responses).toHaveLength(1);
		expect(imported.responses[0].item_id).toBe('ipip-neo-120-001');
	});
});
