#!/usr/bin/env node
/**
 * build-item-index.mjs
 * Generiert kompakte JSON-Bundles fürs Frontend:
 *   src/lib/data-loader/generated/instruments.json
 *     → { id, name, item_count, domains[], locales[] } für die Landing-Übersicht
 *   src/lib/data-loader/generated/<id>.json
 *     → { meta, items, scoring, i18n: { de, en, ... } } gebündelt für den Testlauf
 *
 * Läuft vor dem Build (package.json: "build": "... && npm run gen:data && ...")
 * oder manuell: npm run gen:data
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const OUT_DIR = join(__dirname, '..', 'src', 'lib', 'data-loader', 'generated');

const instrumentsDir = join(DATA_DIR, 'instruments');
const index = [];

/** Lädt die erste Normdatei (norms/*.json) eines Instruments, falls vorhanden */
function loadNorms(instDir) {
	const normsDir = join(instDir, 'norms');
	if (!existsSync(normsDir)) return null;
	const files = readdirSync(normsDir).filter(f => f.endsWith('.json') && f !== 'SOURCE.md');
	if (files.length === 0) return null;
	return JSON.parse(readFileSync(join(normsDir, files[0]), 'utf8'));
}

mkdirSync(OUT_DIR, { recursive: true });

for (const instId of readdirSync(instrumentsDir)) {
	const instDir = join(instrumentsDir, instId);
	if (!existsSync(join(instDir, 'meta.json'))) continue;

	const meta = JSON.parse(readFileSync(join(instDir, 'meta.json'), 'utf8'));
	const items = JSON.parse(readFileSync(join(instDir, 'items.json'), 'utf8'));
	const scoring = existsSync(join(instDir, 'scoring.json'))
		? JSON.parse(readFileSync(join(instDir, 'scoring.json'), 'utf8'))
		: null;

	// i18n laden (alle außer _status.json), nur Locales mit Item-Texten
	const i18nDir = join(instDir, 'i18n');
	const i18n = {};
	const locales = [];
	if (existsSync(i18nDir)) {
		for (const f of readdirSync(i18nDir)) {
			if (!f.endsWith('.json') || f === '_status.json') continue;
			const locale = f.replace('.json', '');
			const trans = JSON.parse(readFileSync(join(i18nDir, f), 'utf8'));
			if (trans.items && Object.keys(trans.items).length > 0) {
				i18n[locale] = trans;
				locales.push(locale);
			}
		}
	}

	// Kompakt-Bundle: nur das, was das Frontend braucht
	const bundle = {
		id: meta.id,
		version: meta.version,
		name: meta.name,
		source_citation: meta.source_citation,
		source_url: meta.source_url,
		domains: meta.domains,
		response_scale: meta.response_scale,
		randomize_order: meta.randomize_order ?? true,
		changelog: meta.changelog ?? [],
		items,
		scoring,
		norms: loadNorms(instDir),
		i18n,
		locales
	};

	const outFile = join(OUT_DIR, `${instId}.json`);
	writeFileSync(outFile, JSON.stringify(bundle));
	console.log(`✓ ${outFile} (${(bundle.items.length)} items, ${locales.join(', ')})`);

	index.push({
		id: meta.id,
		name: meta.name,
		item_count: meta.item_count || items.length,
		domains: meta.domains.map(d => d.id),
		locales,
		// Status pro Locale (aus den Übersetzungsdateien) für Badges auf der Landing
		translation_status: Object.fromEntries(
			locales.map(loc => [loc, i18n[loc]?.translation_status ?? null])
		)
	});
}

writeFileSync(join(OUT_DIR, 'instruments.json'), JSON.stringify(index, null, '\t'));
console.log(`✓ ${join(OUT_DIR, 'instruments.json')} (${index.length} Instrumente)`);
