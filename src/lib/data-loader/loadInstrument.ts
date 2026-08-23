/**
 * loadInstrument.ts
 * Lädt das kompakte Instrument-Bundle (generiert von build-item-index.mjs).
 * Die generierten JSONs werden von Vite als Assets mitgebündelt —
 * kein Server nötig, funktioniert komplett statisch (Cloudflare Pages).
 */
import type { InstrumentMeta, Item, ScoringConfig, Translation, NormData } from '$lib/scoring/types';

export interface InstrumentBundle {
	id: string;
	version: string;
	name: string;
	source_citation: string;
	source_url?: string;
	domains: InstrumentMeta['domains'];
	response_scale: InstrumentMeta['response_scale'];
	randomize_order: boolean;
	changelog?: Array<{ version: string; date: string; description: string }>;
	items: Item[];
	scoring: ScoringConfig | null;
	norms?: NormData | null;
	i18n: Record<string, Translation>;
	locales: string[];
}

/** Lädt die Liste aller verfügbaren Instrumente (für Landing) */
export async function loadAvailableInstruments(): Promise<Array<{ id: string; name: string; item_count: number; domains: string[]; locales: string[] }>> {
	const mod = await import('./generated/instruments.json');
	return mod.default;
}

/** Lädt ein komplettes Instrument-Bundle */
export async function loadInstrument(id: string): Promise<InstrumentBundle | null> {
	try {
		const mod = await import(`./generated/${id}.json`);
		return mod.default as InstrumentBundle;
	} catch {
		return null;
	}
}

/** Gibt die Übersetzung für eine Locale zurück (Fallback: erste verfügbare) */
export function getTranslation(bundle: InstrumentBundle, locale: string): Translation | null {
	if (bundle.i18n[locale]) return bundle.i18n[locale];
	const fallback = bundle.locales[0];
	return fallback ? bundle.i18n[fallback] : null;
}
