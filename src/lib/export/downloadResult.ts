/**
 * downloadResult.ts
 * Exportiert ein Testergebnis client-seitig als JSON oder CSV.
 * Kein Server involviert — erzeugt einen Blob und löst den Download aus.
 */
import type { TestResult } from '$lib/scoring/types';

function download(filename: string, content: string, mime: string) {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function timestamp(): string {
	return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

/** Export als JSON (komplettes Ergebnis inkl. Facets) */
export function downloadResultJson(result: TestResult) {
	const filename = `${result.instrument_id}-${timestamp()}.json`;
	download(filename, JSON.stringify(result, null, 2), 'application/json');
}

/** Export als CSV (eine Zeile pro Domain + Facet) */
export function downloadResultCsv(result: TestResult) {
	const filename = `${result.instrument_id}-${timestamp()}.csv`;

	const rows: string[][] = [
		['instrument_id', result.instrument_id],
		['locale', result.locale],
		['completed_at', result.completed_at],
		[],
		['domain', 'domain_label', 'facet', 'facet_label', 'score', 'items_answered', 'items_total']
	];

	for (const domain of result.domains) {
		rows.push([domain.domain_id, domain.label, '', '', domain.score?.toFixed(2) ?? '', '', '']);
		for (const facet of domain.facets) {
			rows.push([
				'',
				'',
				facet.facet_id,
				facet.label,
				facet.score?.toFixed(2) ?? '',
				String(facet.items_answered),
				String(facet.items_total)
			]);
		}
	}

	const csv = rows
		.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
		.join('\n');

	download(filename, csv, 'text/csv;charset=utf-8');
}
