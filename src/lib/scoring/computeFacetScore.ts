import type { Item, ItemResponse, FacetResult, ScoringConfig } from './types';
import { reverseKey } from './reverseKey';

/**
 * Berechnet den Facet-Score als Mittelwert der beantworteten Items.
 * Reversed-Items (keying: "minus") werden vorher umgepolt.
 *
 * Missing-Handling: mindestens 3 von 4 Items müssen beantwortet sein,
 * sonst ist der Facet-Score null (nicht aussagekräftig).
 */
export function computeFacetScore(
	facetId: string,
	items: Item[],
	responses: Map<string, number>, // item_id → Rohwert
	scoring: ScoringConfig,
	min: number,
	max: number
): FacetResult {
	const facetItems = scoring.facets[facetId]?.items ?? [];
	const answered = facetItems
		.map(id => ({ id, raw: responses.get(id) }))
		.filter((r): r is { id: string; raw: number } => r.raw !== undefined);

	const total = facetItems.length;
	const threshold = Math.ceil(total * 0.75); // mind. 75% beantwortet

	let score: number | null = null;
	if (answered.length >= threshold && answered.length > 0) {
		const sum = answered.reduce((acc, { id, raw }) => {
			const item = items.find(i => i.item_id === id);
			const keying = item?.keying ?? 'plus';
			const value = keying === 'minus' ? reverseKey(raw, min, max) : raw;
			return acc + value;
		}, 0);
		score = sum / answered.length;
	}

	return {
		facet_id: facetId,
		label: facetId, // Label kommt aus meta/i18n im Frontend
		domain_id: facetItems.length > 0 ? scoring.facets[facetId].domain : '',
		score,
		items_answered: answered.length,
		items_total: total
	};
}
