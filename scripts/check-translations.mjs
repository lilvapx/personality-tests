#!/usr/bin/env node
/**
 * check-translations.mjs
 * Konsistenzcheck für Übersetzungen — gedacht für PRs:
 *  - en.json ist Referenz: jede neue Sprache muss dieselben item_ids haben
 *  - Keine leeren Texte, keine Duplikate
 *  - _status.json muss die Sprache führen
 *
 * Nutzung: node scripts/check-translations.mjs [instrument_id] [--strict]
 *  --strict: fehlende Sprachen in _status.json = Fehler (CI)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const instrumentsDir = join(DATA_DIR, 'instruments');

const strict = process.argv.includes('--strict');
const onlyInst = process.argv.find(a => !a.startsWith('-') && a !== process.argv[1]);

let errors = [];
let warnings = [];

function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

const instDirs = readdirSync(instrumentsDir).filter(id =>
	existsSync(join(instrumentsDir, id, 'meta.json')) &&
	(!onlyInst || id === onlyInst)
);

for (const instId of instDirs) {
	const i18nDir = join(instrumentsDir, instId, 'i18n');
	if (!existsSync(i18nDir)) { warn(`${instId}: kein i18n/`); continue; }

	const localeFiles = readdirSync(i18nDir).filter(f => f.endsWith('.json') && f !== '_status.json');
	if (localeFiles.length === 0) { warn(`${instId}: keine Übersetzungen`); continue; }

	// Referenz = en (falls vorhanden), sonst erste Datei
	const enFile = localeFiles.find(f => f === 'en.json') || localeFiles[0];
	const en = JSON.parse(readFileSync(join(i18nDir, enFile), 'utf8'));
	const refIds = Object.keys(en.items || {});

	for (const f of localeFiles) {
		const locale = f.replace('.json', '');
		const trans = JSON.parse(readFileSync(join(i18nDir, f), 'utf8'));
		const ids = Object.keys(trans.items || {});

		if (ids.length === 0) {
			warn(`${instId}/${locale}: Platzhalter (keine Items)`);
			continue;
		}

		// Gleiche Keys wie Referenz
		const missing = refIds.filter(id => !ids.includes(id));
		const extra = ids.filter(id => !refIds.includes(id));
		if (missing.length) err(`${instId}/${locale}: ${missing.length} fehlende Keys (z.B. ${missing.slice(0,3).join(', ')})`);
		if (extra.length) err(`${instId}/${locale}: ${extra.length} überschüssige Keys (z.B. ${extra.slice(0,3).join(', ')})`);

		// Leere Texte
		for (const id of ids) {
			if (!trans.items[id]?.text?.trim()) err(`${instId}/${locale}: leerer Text für ${id}`);
		}
	}

	// _status.json
	const statusFile = join(i18nDir, '_status.json');
	if (existsSync(statusFile)) {
		const status = JSON.parse(readFileSync(statusFile, 'utf8'));
		const statusLocales = Object.keys(status.translations || {});
		for (const f of localeFiles) {
			const locale = f.replace('.json', '');
			if (!statusLocales.includes(locale)) {
				const msg = `${instId}: ${locale} fehlt in _status.json`;
				strict ? err(msg) : warn(msg);
			}
		}
	} else {
		warn(`${instId}: keine _status.json`);
	}
}

console.log('=== Translations-Check ===');
if (warnings.length) { console.log(`⚠️  ${warnings.length} Warnung(en):`); warnings.forEach(w => console.log(`  - ${w}`)); }
if (errors.length) {
	console.error(`❌ ${errors.length} Fehler:`);
	errors.forEach(e => console.error(`  - ${e}`));
	process.exit(1);
}
console.log(`✅ OK (${warnings.length} Warnungen)`);
