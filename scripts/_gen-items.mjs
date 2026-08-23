#!/usr/bin/env node
// Generiert data/instruments/ipip-neo-120/items.json
// 5 Domains × 6 Facetten × 4 Items = 120 Items, sprachneutral.
// Keying abwechselnd (plus/minus) — Platzhalter; echte Keying-Tabelle
// wird aus der IPIP-Quelle übernommen, sobald die Item-Texte final sind.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'data', 'instruments', 'ipip-neo-120');

const domains = ['E', 'A', 'C', 'N', 'O'];
const facetsPerDomain = 6;

const items = [];
let n = 0;
for (const d of domains) {
	for (let f = 1; f <= facetsPerDomain; f++) {
		for (let i = 1; i <= 4; i++) {
			n++;
			items.push({
				item_id: `ipip-neo-120-${String(n).padStart(3, '0')}`,
				domain: d,
				facet: `${d}${f}`,
				keying: (n % 2 === 1) ? 'plus' : 'minus'
			});
		}
	}
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'items.json'), JSON.stringify(items, null, '\t') + '\n');
console.log(`items.json: ${items.length} Items geschrieben`);
