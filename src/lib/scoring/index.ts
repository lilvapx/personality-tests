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
}

export function scoreTest(input: ScoringInput): TestResult {
	const respMap = new Map(input.responses.map(r => [r.item_id, r.value]));

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
			return { ...facetResult, label: facet.label };
		});

		return computeDomainScore(domain.id, domain.label, facets);
	});

	return {
		instrument_id: input.instrumentId,
		locale: input.locale,
		domains: domainResults,
		completed_at: new Date().toISOString()
	};
}
