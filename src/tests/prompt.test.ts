import { describe, it, expect } from 'vitest';
import { buildPrompt } from '$lib/scoring/prompt';
import type { Item, TestResult } from '$lib/scoring/types';

const items: Item[] = [
	{ item_id: 'ipip-neo-120-001', domain: 'E', facet: 'E1', keying: 'plus' },
	{ item_id: 'ipip-neo-120-002', domain: 'E', facet: 'E1', keying: 'minus' }
];

const responses = [
	{ item_id: 'ipip-neo-120-001', value: 5 },
	{ item_id: 'ipip-neo-120-002', value: 2 }
];

const itemTexts: Record<string, string> = {
	'ipip-neo-120-001': 'Ich mache mir Sorgen über Dinge.',
	'ipip-neo-120-002': 'Ich finde leicht Freunde.'
};

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
		}
	]
};

const params = {
	result,
	items,
	responses,
	itemTexts,
	name: 'IPIP-NEO-120',
	version: '1.0.0',
	scaleMin: 1,
	scaleMax: 5
};

describe('buildPrompt', () => {
	it('ersetzt alle Platzhalter', () => {
		const prompt = buildPrompt(params);
		expect(prompt).not.toContain('{{IPIP_VERSION}}');
		expect(prompt).not.toContain('{{SCALE_MIN}}');
		expect(prompt).not.toContain('{{SCALE_MAX}}');
		expect(prompt).not.toContain('{{NORM_GROUP}}');
		expect(prompt).not.toContain('{{RESULTS}}');
		expect(prompt).not.toContain('{{ITEM_RESPONSES}}');
	});

	it('enthält die Testinformationen', () => {
		const prompt = buildPrompt(params);
		expect(prompt).toContain('1.0.0');
		expect(prompt).toContain('1 bis 5');
	});

	it('bettet die Ergebnisse als JSON ein', () => {
		const prompt = buildPrompt(params);
		expect(prompt).toContain('"Extraversion"');
		expect(prompt).toContain('"raw_score"');
		expect(prompt).toContain('"percentile"');
	});

	it('bettet alle Items mit Text und Antwort ein', () => {
		const prompt = buildPrompt(params);
		expect(prompt).toContain('"Ich mache mir Sorgen über Dinge."');
		expect(prompt).toContain('"Ich finde leicht Freunde."');
		expect(prompt).toContain('"response": 5');
		expect(prompt).toContain('"reverse_scored": true');
	});

	it('beginnt mit der Aufgabenstellung', () => {
		const prompt = buildPrompt(params);
		expect(prompt.startsWith('# Aufgabe')).toBe(true);
	});

	it('endet mit dem Start der Nachbefragung', () => {
		const prompt = buildPrompt(params);
		expect(prompt.trim().endsWith('bevor du die nächste Analyse durchführst.')).toBe(true);
	});
});
