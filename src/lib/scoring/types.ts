/**
 * Zentrale Typen für Instrumente, Items, Antworten und Ergebnisse.
 * Sprachneutral — Texte kommen aus i18n, Logik hier.
 */

/** Antwortskala eines Instruments (z.B. Likert 1-5) */
export interface ResponseScale {
	min: number;
	max: number;
	type: 'likert' | 'binary' | 'custom';
}

/** Facet-Definition aus meta.json */
export interface FacetDef {
	id: string;
	label: string;
}

/** Domain-Definition aus meta.json */
export interface DomainDef {
	id: string;
	label: string;
	facets?: FacetDef[];
}

/** Metadaten eines Instruments */
export interface InstrumentMeta {
	id: string;
	version: string;
	name: string;
	source_citation: string;
	source_url?: string;
	license_note?: string;
	domains: DomainDef[];
	item_count: number;
	response_scale: ResponseScale;
}

/** Ein Item — sprachneutral */
export interface Item {
	item_id: string;
	domain: string;
	facet?: string;
	keying: 'plus' | 'minus';
}

/** Übersetzungsdatei (i18n/[locale].json) */
export interface Translation {
	locale: string;
	items: Record<string, { text: string }>;
	response_scale: {
		labels: Record<string, string>;
	};
	translation_status?: TranslationStatus;
}

/** Vierstufiger Qualitätsstatus einer Übersetzung */
export type TranslationStatus =
	| 'official_ipip' // offizielle IPIP-Quelle
	| 'community_verified' // von Muttersprachlern/Experten geprüft
	| 'community_draft' // eigene/Community-Übersetzung, ungeprüft
	| 'machine_draft'; // maschinelle Übersetzung

/** Scoring-Konfiguration */
export interface ScoringConfig {
	instrument_id: string;
	version?: string;
	response_range?: { min: number; max: number };
	facets: Record<string, {
		domain: string;
		items: string[];
	}>;
}

/** Antwort eines Users auf ein Item (Rohwert, 1-5) */
export interface ItemResponse {
	item_id: string;
	value: number; // Rohwert auf der Skala
}

/** Facet-Ergebnis */
export interface FacetResult {
	facet_id: string;
	label: string;
	domain_id: string;
	score: number | null; // Mittelwert, null wenn zu wenige Antworten
	items_answered: number;
	items_total: number;
	percentile?: number | null; // Perzentil (0-100), wenn Normdaten vorhanden
}

/** Domain-Ergebnis */
export interface DomainResult {
	domain_id: string;
	label: string;
	score: number | null; // Mittelwert der Facet-Scores
	facets: FacetResult[];
	percentile?: number | null; // Perzentil (0-100), wenn Normdaten vorhanden
}

/** Normdaten für ein Instrument (z.B. ESCS) */
export interface NormData {
	instrument_id: string;
	source: string;
	scale: string;
	sample?: string;
	facets: Record<string, { mean: number; sd: number; n?: number; alpha?: number | null; source?: string }>;
}

/** Komplettes Ergebnis */
export interface TestResult {
	instrument_id: string;
	locale: string;
	domains: DomainResult[];
	completed_at: string;
}
