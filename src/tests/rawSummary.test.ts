import { describe, it, expect } from 'vitest';
import { buildRawSummary } from '$lib/scoring/rawSummary';
import type { TestResult } from '$lib/scoring/types';

const result: TestResult = {
	instrument_id: 'ipip-neo-120',
	locale: 'de',
	completed_at: '2026-08-23T12:00:00.000Z',
	domains: [
		{
			domain_id: 'E',
			label: 'Extraversion',
			label_en: 'Extraversion',
			score: 3.42,
			percentile: 62,
			facets: [
				{ facet_id: 'E1', label: 'Freundlichkeit', label_en: 'Friendliness', domain_id: 'E', score: 3.2, items_answered: 10, items_total: 10, percentile: 55 },
				{ facet_id: 'E2', label: 'Geselligkeit', label_en: 'Gregariousness', domain_id: 'E', score: 4.0, items_answered: 10, items_total: 10, percentile: 70 }
			]
		},
		{
			domain_id: 'A',
			label: 'Verträglichkeit',
			label_en: 'Agreeableness',
			score: null,
			percentile: null,
			facets: [
				{ facet_id: 'A1', label: 'Vertrauen', label_en: 'Trust', domain_id: 'A', score: null, items_answered: 0, items_total: 10, percentile: null }
			]
		}
	]
};

describe('buildRawSummary', () => {
	it('erzeugt Kopfzeile mit Instrument, Locale, Datum', () => {
		const lines = buildRawSummary(result).split('\n');
		expect(lines[0]).toContain('ipip-neo-120');
		expect(lines[0]).toContain('de');
		expect(lines[0]).toContain('2026-08-23');
	});

	it('enthält pro Domain eine Zeile mit Score und Perzentil', () => {
		const text = buildRawSummary(result);
		expect(text).toContain('E Extraversion');
		expect(text).toContain('3.42');
		expect(text).toContain('62%');
	});

	it('enthält Facetten mit IDs, Scores und Perzentilen', () => {
		const text = buildRawSummary(result);
		expect(text).toContain('E1 3.20');
		expect(text).toContain('55%');
		expect(text).toContain('E2 4.00');
	});

	it('handhabt null-Scores (zu wenige Antworten) mit –', () => {
		const text = buildRawSummary(result);
		expect(text).toContain('A Verträglichkeit (Agreeableness): –');
		expect(text).toContain('A1 –');
	});

	it('nutzt label_en nur wenn abweichend', () => {
		const text = buildRawSummary(result);
		// E: label == label_en → kein Doppel
		expect(text).toContain('E Extraversion:');
		// A: label != label_en → Doppel mit Klammer
		expect(text).toContain('A Verträglichkeit (Agreeableness):');
	});
});
