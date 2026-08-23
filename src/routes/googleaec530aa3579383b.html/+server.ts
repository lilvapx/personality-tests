import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response('google-site-verification: googleaec530aa3579383b.html', {
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': 'no-cache'
		}
	});
};
