/**
 * Einstiegspunkt fürs Scoring: kompletter Testlauf → Ergebnis.
 * Reine Funktion, keine UI-Abhängigkeit.
 */
import type { DomainDef, Item, ItemResponse, ScoringConfig, TestResult } from './types';
import { computeFacetScore } from './computeFacetScore';
import { computeDomainScore } from './computeDomainScore';

export interface ScoringInput {
	instrumentId: string;
	locale: string;
	items: Item[];
	domains: DomainDef[];
	scoring: ScoringConfig;
	responses: ItemResponse[];
	min: number;
	max: number;
	/** Übersetzte Domain-/Facet-Namen (aus i18n-Datei), optional */
	i18nLabels?: { domains?: Record<string, string>; facets?: Record<string, string> } | null;
}

export function scoreTest(input: ScoringInput): TestResult {
	const respMap = new Map(input.responses.map(r => [r.item_id, r.value]));
	const labels = input.i18nLabels ?? null;

	const domainResults = input.domains.map(domain => {
		const facets = (domain.facets ?? []).map(facet => {
			const facetResult = computeFacetScore(
				facet.id,
				input.items,
				respMap,
				input.scoring,
				input.min,
				input.max
			);
			return {
				...facetResult,
				// Übersetzter Name, Fallback: Original
				label: labels?.facets?.[facet.id] ?? facet.label,
				label_en: facet.label
			};
		});

		return computeDomainScore(domain.id, domain.label, facets, labels?.domains?.[domain.id] ?? null);
	});

	return {
		instrument_id: input.instrumentId,
		locale: input.locale,
		domains: domainResults,
		completed_at: new Date().toISOString()
	};
}
