/**
 * seo.ts
 * Zentrale SEO-Helfer: Meta-Tags, Open Graph, Twitter Cards, JSON-LD.
 *
 * Alle Seiten bauen ihre <svelte:head>-Tags über diese Funktionen —
 * konsistent und ohne Wiederholung.
 */

export interface SeoProps {
	title: string;
	description: string;
	/** Kanonische URL (ohne Trailing Slash) */
	canonical?: string;
	/** Pfad relativ zur Basis (z.B. /ipip-neo-120) — für OG-URL */
	path?: string;
	/** Optionales OG-Bild (absolut oder relativ zu /og/) */
	ogImage?: string;
	type?: 'website' | 'article';
	/** JSON-LD-Struktur (Objekte werden als @graph eingebettet) */
	jsonLd?: Record<string, unknown>[];
}

const SITE_URL = 'https://personality-tests.pages.dev';

type SeoTag =
	| { title: string }
	| { name: string; content: string }
	| { rel: string; href: string }
	| { property: string; content: string }
	| { script: string; json: string };

export function seo(props: SeoProps) {
	const url = props.canonical ?? (props.path ? `${SITE_URL}${props.path}` : SITE_URL);
	const image = props.ogImage ?? `${SITE_URL}/og/default.png`;

	const tags: SeoTag[] = [
		// Basic
		{ title: props.title },
		{ name: 'description', content: props.description },
		{ rel: 'canonical', href: url },

		// Open Graph
		{ property: 'og:title', content: props.title },
		{ property: 'og:description', content: props.description },
		{ property: 'og:url', content: url },
		{ property: 'og:type', content: props.type ?? 'website' },
		{ property: 'og:site_name', content: 'personality-tests' },
		{ property: 'og:image', content: image },
		{ property: 'og:locale', content: 'de_DE' },

		// Twitter Card
		{ name: 'twitter:card', content: 'summary' },
		{ name: 'twitter:title', content: props.title },
		{ name: 'twitter:description', content: props.description },
		{ name: 'twitter:image', content: image }
	];

	// JSON-LD als <script type="application/ld+json">
	const jsonLdTags: SeoTag[] = props.jsonLd?.map(obj => ({
		script: 'application/ld+json',
		json: JSON.stringify(obj)
	})) ?? [];

	return [...tags, ...jsonLdTags];
}

/** Snippet-Hilfer für strukturierte Daten: WebSite + WebApplication */
export function websiteJsonLd() {
	return [
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'personality-tests',
			url: SITE_URL,
			description: 'Freie, quelloffene wissenschaftliche Persönlichkeitstests (Big Five / IPIP-NEO). Keine Registrierung, keine Datenabgabe — alles läuft im Browser.',
			inLanguage: ['de', 'en', 'lt']
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebApplication',
			name: 'personality-tests',
			url: SITE_URL,
			applicationCategory: 'SelfAssessmentApplication',
			operatingSystem: 'Any',
			offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
			description: 'Kostenlose Big-Five-Persönlichkeitstests (IPIP-NEO-120/300) mit Auswertung im Browser.'
		}
	];
}

/**
 * Rendert die SEO-Tags als HTML-String für {@html}-Einsatz im <svelte:head>.
 */
export function renderSeoHead(props: SeoProps): string {
	const tags = seo(props);
	return tags
		.map(tag => {
			if ('title' in tag && !('name' in tag) && !('rel' in tag) && !('property' in tag) && !('script' in tag)) {
				return `<title>${escapeHtml(tag.title)}</title>`;
			}
			if ('rel' in tag && 'href' in tag) {
				return `<link rel="${escapeHtml(tag.rel)}" href="${escapeHtml(tag.href)}" />`;
			}
			if ('script' in tag && 'json' in tag) {
				return `<script type="application/ld+json">${escapeHtml(tag.json)}</script>`;
			}
			if ('name' in tag && 'content' in tag) {
				return `<meta name="${escapeHtml(tag.name)}" content="${escapeHtml(tag.content)}" />`;
			}
			if ('property' in tag && 'content' in tag) {
				return `<meta property="${escapeHtml(tag.property)}" content="${escapeHtml(tag.content)}" />`;
			}
			return '';
		})
		.join('\n');
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
