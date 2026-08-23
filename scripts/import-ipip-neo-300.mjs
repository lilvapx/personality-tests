#!/usr/bin/env node
/**
 * import-ipip-neo-300.mjs
 * Importiert das offizielle IPIP-NEO-300 (Goldberg, 1999) aus dem
 * IPIP Repository (https://ipip-api.ipsyc.io/api/v1/instruments/ipip-neo-300).
 *
 * 300 Items, 30 Facetten (10 Items pro Facet), inkl. korrektem Polarity-Keying.
 * Nur Englisch — es existieren KEINE offiziellen Übersetzungen für NEO-300
 * (kein de/lt). Lizenz: Public Domain (IPIP).
 *
 * Verwendung: node scripts/import-ipip-neo-300.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'data', 'instruments', 'ipip-neo-300');
const i18nDir = join(outDir, 'i18n');
const normsDir = join(outDir, 'norms');

// Quelle: API-Daten (einmalig gefetcht, in /tmp/neo300.json gespeichert)
import { readFileSync } from 'node:fs';
const api = JSON.parse(readFileSync('/tmp/neo300.json', 'utf8'));

const scales = api.scales || [];
if (scales.length !== 30) throw new Error(`Erwartet 30 Skalen, bekommen ${scales.length}`);
if ((api.item_count || 0) !== 300) throw new Error(`Erwartet 300 Items, bekommen ${api.item_count}`);

// Domain-Zuordnung aus Facet-Code (N1 → N, E1 → E, ...)
const DOMAIN_OF = { N: 'N', E: 'E', O: 'O', A: 'A', C: 'C' };

// --- items.json + en.json bauen ---
const items = [];
const enItems = {};
let n = 0;

for (const scale of scales) {
	const code = scale.code; // z.B. "N1_ANXIETY"
	const facet = code.split('_')[0]; // "N1"
	const domain = DOMAIN_OF[facet[0]];
	if (!domain) throw new Error(`Unbekannte Domain für Facet ${facet}`);

	for (const member of scale.members) {
		n++;
		const itemId = `ipip-neo-300-${String(n).padStart(3, '0')}`;
		const keying = member.polarity === 'positive' ? 'plus' : 'minus';
		items.push({ item_id: itemId, domain, facet, keying });
		enItems[itemId] = { text: member.item_text };
	}
}

const itemsJson = items.map(({ item_id, domain, facet, keying }) => ({ item_id, domain, facet, keying }));

// --- scoring.json: Facet → Items ---
const facetMap = {};
for (const it of items) {
	if (!facetMap[it.facet]) facetMap[it.facet] = { domain: it.domain, items: [] };
	facetMap[it.facet].items.push(it.item_id);
}

const scoring = {
	instrument_id: 'ipip-neo-300',
	version: '1.0.0',
	response_range: { min: 1, max: 5 },
	keying: 'in-items-json',
	notes: 'Offizielle IPIP-NEO-300 Items (Goldberg, 1999), Quelle: https://ipip-api.ipsyc.io/api/v1/instruments/ipip-neo-300',
	aggregation: {
		facet_score: 'mean of items in facet',
		domain_score: 'mean of facet scores in domain',
		missing_handling: 'mindestens 8 von 10 Items pro Facet nötig, sonst Facet = null; Domain braucht mindestens 4 von 6 Facetten'
	},
	facets: facetMap
};

// --- meta.json ---
const meta = {
	id: 'ipip-neo-300',
	version: '1.0.0',
	name: 'IPIP-NEO-300',
	source_citation: 'Goldberg, L. R. (1999). A broad-bandwidth, public domain, personality inventory measuring the lower-level facets of several five-factor models. In I. Mervielde, I. Deary, F. De Fruyt, & F. Ostendorf (Eds.), Personality Psychology in Europe (Vol. 7, pp. 7–28). Tilburg University Press.',
	source_url: 'https://ipip.ori.org/newNEOKey.htm',
	license_note: 'IPIP-Items sind Public Domain (https://ipip.ori.org). Keine offiziellen Übersetzungen verfügbar.',
	domains: [
		{ id: 'N', label: 'Neuroticism', facets: [
			{ id: 'N1', label: 'Anxiety' }, { id: 'N2', label: 'Anger' }, { id: 'N3', label: 'Depression' },
			{ id: 'N4', label: 'Self-Consciousness' }, { id: 'N5', label: 'Immoderation' }, { id: 'N6', label: 'Vulnerability' }
		]},
		{ id: 'E', label: 'Extraversion', facets: [
			{ id: 'E1', label: 'Friendliness' }, { id: 'E2', label: 'Gregariousness' }, { id: 'E3', label: 'Assertiveness' },
			{ id: 'E4', label: 'Activity Level' }, { id: 'E5', label: 'Excitement-Seeking' }, { id: 'E6', label: 'Cheerfulness' }
		]},
		{ id: 'O', label: 'Openness to Experience', facets: [
			{ id: 'O1', label: 'Imagination' }, { id: 'O2', label: 'Artistic Interests' }, { id: 'O3', label: 'Emotionality' },
			{ id: 'O4', label: 'Adventurousness' }, { id: 'O5', label: 'Intellect' }, { id: 'O6', label: 'Liberalism' }
		]},
		{ id: 'A', label: 'Agreeableness', facets: [
			{ id: 'A1', label: 'Trust' }, { id: 'A2', label: 'Morality' }, { id: 'A3', label: 'Altruism' },
			{ id: 'A4', label: 'Cooperation' }, { id: 'A5', label: 'Modesty' }, { id: 'A6', label: 'Sympathy' }
		]},
		{ id: 'C', label: 'Conscientiousness', facets: [
			{ id: 'C1', label: 'Self-Efficacy' }, { id: 'C2', label: 'Orderliness' }, { id: 'C3', label: 'Dutifulness' },
			{ id: 'C4', label: 'Achievement-Striving' }, { id: 'C5', label: 'Self-Discipline' }, { id: 'C6', label: 'Cautiousness' }
		]}
	],
	item_count: 300,
	response_scale: { min: 1, max: 5, type: 'likert' },
	randomize_order: true,
	randomize_order_note: 'Standard: Items werden pro Sitzung randomisiert präsentiert'
};

// --- en.json ---
const en = {
	locale: 'en',
	items: enItems,
	response_scale: {
		labels: {
			"1": "Very inaccurate",
			"2": "Moderately inaccurate",
			"3": "Neither accurate nor inaccurate",
			"4": "Moderately accurate",
			"5": "Very accurate"
		}
	},
	translation_status: "official"
};

// --- _status.json ---
const status = {
	instrument_id: 'ipip-neo-300',
	translations: {
		en: {
			status: 'official',
			updated: '2026-08-23',
			note: 'Original-Items aus IPIP Repository (Goldberg, 1999), Public Domain'
		}
	}
};

mkdirSync(i18nDir, { recursive: true });
mkdirSync(normsDir, { recursive: true });
writeFileSync(join(outDir, 'meta.json'), JSON.stringify(meta, null, '\t') + '\n');
writeFileSync(join(outDir, 'items.json'), JSON.stringify(itemsJson, null, '\t') + '\n');
writeFileSync(join(outDir, 'scoring.json'), JSON.stringify(scoring, null, '\t') + '\n');
writeFileSync(join(i18nDir, 'en.json'), JSON.stringify(en, null, '\t') + '\n');
writeFileSync(join(i18nDir, '_status.json'), JSON.stringify(status, null, '\t') + '\n');

console.log(`✅ IPIP-NEO-300 importiert: ${items.length} Items, ${Object.keys(facetMap).length} Facetten`);
console.log(`   Keying: ${items.filter(i => i.keying === 'plus').length} plus, ${items.filter(i => i.keying === 'minus').length} minus`);
