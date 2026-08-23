import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'data');
const instrumentsDir = join(DATA_DIR, 'instruments');

describe('Datenintegrität', () => {
	const instDirs = readdirSync(instrumentsDir).filter(id =>
		existsSync(join(instrumentsDir, id, 'meta.json'))
	);

	it('mindestens ein Instrument vorhanden', () => {
		expect(instDirs.length).toBeGreaterThan(0);
	});

	for (const instId of instDirs) {
		describe(instId, () => {
			const meta = JSON.parse(readFileSync(join(instrumentsDir, instId, 'meta.json'), 'utf8'));
			const items = JSON.parse(readFileSync(join(instrumentsDir, instId, 'items.json'), 'utf8'));
			const scoring = existsSync(join(instrumentsDir, instId, 'scoring.json'))
				? JSON.parse(readFileSync(join(instrumentsDir, instId, 'scoring.json'), 'utf8'))
				: null;

			it('meta.item_count stimmt mit items.json überein', () => {
				if (meta.item_count) expect(items.length).toBe(meta.item_count);
			});

			it('item_ids sind eindeutig', () => {
				const ids = items.map((i: { item_id: string }) => i.item_id);
				expect(new Set(ids).size).toBe(ids.length);
			});

			it('alle Items haben gültiges keying', () => {
				for (const item of items) {
					expect(['plus', 'minus']).toContain(item.keying);
				}
			});

			it('alle Facets in items.json existieren in meta.json', () => {
				const metaFacets = new Set(meta.domains.flatMap((d: any) => d.facets?.map((f: any) => f.id) ?? []));
				for (const item of items) {
					if (item.facet) expect(metaFacets.has(item.facet)).toBe(true);
				}
			});

			it('scoring.json deckt alle Facets ab', () => {
				if (!scoring) return;
				const itemFacets = new Set(items.map((i: { facet: string }) => i.facet));
				for (const f of Object.keys(scoring.facets || {})) {
					expect(itemFacets.has(f)).toBe(true);
				}
			});

			it('jede Übersetzung hat alle item_ids (außer Platzhalter)', () => {
				const i18nDir = join(instrumentsDir, instId, 'i18n');
				if (!existsSync(i18nDir)) return;
				const itemIds = new Set(items.map((i: { item_id: string }) => i.item_id));
				for (const f of readdirSync(i18nDir).filter(f => f.endsWith('.json') && f !== '_status.json')) {
					const trans = JSON.parse(readFileSync(join(i18nDir, f), 'utf8'));
					const transIds = Object.keys(trans.items || {});
					if (transIds.length === 0) continue; // Platzhalter
					for (const id of itemIds) expect(transIds).toContain(id);
					for (const id of transIds) expect(itemIds.has(id)).toBe(true);
				}
			});

			it('Skalen-Labels vollständig', () => {
				const i18nDir = join(instrumentsDir, instId, 'i18n');
				if (!existsSync(i18nDir)) return;
				const scale = meta.response_scale || {};
				for (const f of readdirSync(i18nDir).filter(f => f.endsWith('.json') && f !== '_status.json')) {
					const trans = JSON.parse(readFileSync(join(i18nDir, f), 'utf8'));
					const labels = trans.response_scale?.labels || {};
					for (let v = scale.min || 1; v <= (scale.max || 5); v++) {
						expect(labels[String(v)], `${f} Label ${v}`).toBeTruthy();
					}
				}
			});
		});
	}
});
