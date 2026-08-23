import type { Handle } from '@sveltejs/kit';

/**
 * Globale Security-Header für alle SSR-Responses.
 * Die CSP selbst setzt SvelteKit (siehe vite.config.ts → csp) mit Nonces —
 * hier kommen nur die Header, die kein Nonce brauchen.
 *
 * Zusätzlich: Google-Search-Console-Verifikationsdatei wird VOR der
 * SvelteKit-Routenauflösung ausgeliefert (SvelteKit normalisiert .html
 * sonst per 308-Redirect weg — die Verifikation würde nie ankommen).
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Google-Search-Console-Verifikation (exakte Pfadübereinstimmung)
	if (event.url.pathname === '/googleaec530aa3579383b.html') {
		return new Response('google-site-verification: googleaec530aa3579383b.html', {
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Cache-Control': 'no-cache'
			}
		});
	}

	const response = await resolve(event);

	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'no-referrer');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

	return response;
};
