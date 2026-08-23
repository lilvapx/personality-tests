#!/usr/bin/env node
/**
 * validate-data.mjs
 * Prüft die Datenintegrität aller Instrumente:
 *  - JSON-Schemas (instrument, item, translation)
 *  - meta.json ↔ items.json ↔ scoring.json Konsistenz
 *  - Keying gesetzt, item_ids eindeutig, Facets existieren
 *  - i18n: jedes Item hat eine Übersetzung in en/de, keine fehlenden Keys
 *
 * Exit-Code 1 bei Fehlern — für CI (validate.yml) und Pre-Deploy.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

let errors = [];
let warnings = [];

function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

// Minimaler JSON-Schema-Validator (draft-07 Kern: required, properties, enum, pattern, type)
function validateSchema(data, schema, path = '') {
	const { required = [], properties = {}, enum: enumVals, type, pattern, minLength, additionalProperties = true } = schema;
	if (type === 'object' || schema.type === undefined) {
		if (typeof data !== 'object' || data === null || Array.isArray(data)) {
			err(`${path}: erwartet object, bekommen ${typeof data}`);
			return;
		}
		for (const req of required) {
			if (!(req in data)) err(`${path}: fehlendes Pflichtfeld "${req}"`);
		}
		for (const [key, val] of Object.entries(data)) {
			if (!(key in properties) && additionalProperties === false) {
				err(`${path}: unerwartetes Feld "${key}"`);
				continue;
			}
			if (key in properties) validateSchema(val, properties[key], `${path}.${key}`);
		}
	} else if (type === 'array') {
		if (!Array.isArray(data)) { err(`${path}: erwartet array`); return; }
		const itemsSchema = schema.items;
		if (itemsSchema) data.forEach((item, i) => validateSchema(item, itemsSchema, `${path}[${i}]`));
	} else if (type === 'string') {
		if (typeof data !== 'string') { err(`${path}: erwartet string`); return; }
		if (enumVals && !enumVals.includes(data)) err(`${path}: "${data}" nicht in enum ${JSON.stringify(enumVals)}`);
		if (pattern && !new RegExp(pattern).test(data)) err(`${path}: "${data}" matcht nicht ${pattern}`);
		if (minLength && data.length < minLength) err(`${path}: zu kurz (<${minLength})`);
	} else if (type === 'integer') {
		if (!Number.isInteger(data)) err(`${path}: erwartet integer, bekommen ${JSON.stringify(data)}`);
	}
}

function loadJSON(p) {
	try { return JSON.parse(readFileSync(p, 'utf8')); }
	catch (e) { err(`JSON-Fehler in ${p}: ${e.message}`); return null; }
}

// --- Schemas laden ---
const schemaDir = join(DATA_DIR, 'schema');
const instrumentSchema = loadJSON(join(schemaDir, 'instrument.schema.json'));
const itemSchema = loadJSON(join(schemaDir, 'item.schema.json'));
const translationSchema = loadJSON(join(schemaDir, 'translation.schema.json'));
const translationStatusSchema = loadJSON(join(schemaDir, 'translation-status.schema.json'));
if (!instrumentSchema || !itemSchema || !translationSchema || !translationStatusSchema) {
	console.error('❌ Schemas konnten nicht geladen werden');
	process.exit(1);
}

// --- Instrumente iterieren ---
const instrumentsDir = join(DATA_DIR, 'instruments');
for (const instId of readdirSync(instrumentsDir)) {
	const instDir = join(instrumentsDir, instId);
	if (!existsSync(join(instDir, 'meta.json'))) continue; // Platzhalter-Ordner (z.B. hexaco-60)

	console.log(`\n=== ${instId} ===`);

	const meta = loadJSON(join(instDir, 'meta.json'));
	const items = loadJSON(join(instDir, 'items.json'));
	const scoring = loadJSON(join(instDir, 'scoring.json'));
	if (!meta || !items || !scoring) continue;

	validateSchema(meta, instrumentSchema, 'meta');
	items.forEach((item, i) => validateSchema(item, itemSchema, `items[${i}]`));

	// scoring.json: Struktur-Grobcheck (aggregation + facets vorhanden)
	if (!scoring.facets || typeof scoring.facets !== 'object') {
		err('scoring.json: fehlendes Feld "facets"');
	}
	if (meta.item_count && meta.item_count !== items.length) {
		err(`meta.item_count (${meta.item_count}) ≠ items.json (${items.length})`);
	}

	// item_ids eindeutig + Facet/Keying
	const ids = new Set();
	const facets = new Set();
	for (const item of items) {
		if (ids.has(item.item_id)) err(`doppelte item_id: ${item.item_id}`);
		ids.add(item.item_id);
		if (item.facet) facets.add(item.facet);
		if (!['plus', 'minus'].includes(item.keying)) err(`item ${item.item_id}: keying "${item.keying}" ungültig`);
		// Facet muss in meta existieren
		if (item.facet) {
			const domain = meta.domains.find(d => d.id === item.domain);
			if (!domain) err(`item ${item.item_id}: domain "${item.domain}" nicht in meta`);
			else if (!domain.facets?.some(f => f.id === item.facet)) err(`item ${item.item_id}: facet "${item.facet}" nicht in meta`);
		}
	}

	// scoring.json: alle Facets aus items abgedeckt, items zugeordnet
	const scoringFacets = Object.keys(scoring.facets || {});
	for (const f of scoringFacets) {
		if (!facets.has(f)) err(`scoring.facets.${f}: Facet existiert nicht in items`);
		const fItems = scoring.facets[f].items || [];
		for (const id of fItems) if (!ids.has(id)) err(`scoring.facets.${f}: item "${id}" nicht in items.json`);
	}

	// i18n
	const i18nDir = join(instDir, 'i18n');
	const status = existsSync(join(i18nDir, '_status.json')) ? loadJSON(join(i18nDir, '_status.json')) : null;
	if (status) validateSchema(status, translationStatusSchema, 'i18n/_status.json');
	const locales = readdirSync(i18nDir).filter(f => f.endsWith('.json') && f !== '_status.json');
	for (const locFile of locales) {
		const locale = locFile.replace('.json', '');
		const trans = loadJSON(join(i18nDir, locFile));
		if (!trans) continue;
		validateSchema(trans, translationSchema, `i18n/${locFile}`);

		// Konsistenz: translation_status in der Übersetzung muss mit _status.json übereinstimmen
		const statusEntry = status?.translations?.[locale];
		if (statusEntry && trans.translation_status && statusEntry.status !== trans.translation_status) {
			err(`i18n/${locFile}: translation_status (${trans.translation_status}) ≠ _status.json (${statusEntry.status})`);
		}


		const transIds = Object.keys(trans.items || {});
		// Jedes Item braucht eine Übersetzung (außer lt.json ist Platzhalter)
		const isPlaceholder = transIds.length === 0;
		if (isPlaceholder) {
			warn(`i18n/${locFile}: keine Item-Texte (Platzhalter?)`);
		} else {
			for (const id of ids) {
				if (!transIds.includes(id)) err(`i18n/${locFile}: fehlende Übersetzung für ${id}`);
			}
			for (const id of transIds) {
				if (!ids.has(id)) err(`i18n/${locFile}: übersetzte item_id "${id}" existiert nicht in items.json`);
			}
		}
		// Skalen-Labels
		const labels = trans.response_scale?.labels || {};
		const scale = meta.response_scale || {};
		for (let v = scale.min || 1; v <= (scale.max || 5); v++) {
			if (!labels[String(v)]) err(`i18n/${locFile}: fehlendes Skalen-Label für ${v}`);
		}
		if (status && !status.translations?.[locale]) warn(`i18n/${locFile}: kein Eintrag in _status.json`);
	}
}

console.log('\n===================');
if (warnings.length) {
	console.log(`⚠️  ${warnings.length} Warnung(en):`);
	warnings.forEach(w => console.log(`  - ${w}`));
}
if (errors.length) {
	console.error(`❌ ${errors.length} Fehler:`);
	errors.forEach(e => console.error(`  - ${e}`));
	console.error('\nValidierung FEHLGESCHLAGEN');
	process.exit(1);
}
console.log(`✅ Validierung OK (${warnings.length} Warnungen)`);
