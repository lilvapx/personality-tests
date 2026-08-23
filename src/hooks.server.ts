import type { Handle } from '@sveltejs/kit';

/**
 * Globale Security-Header für alle SSR-Responses.
 * Die CSP selbst setzt SvelteKit (siehe vite.config.ts → csp) mit Nonces —
 * hier kommen nur die Header, die kein Nonce brauchen.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'no-referrer');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

	return response;
};
