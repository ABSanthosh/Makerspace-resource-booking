import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const createSupabaseClient: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			// NOTE: defaulting path to '/' here to support Sveltekit v2 which requires it to be
			// specified.
			set: (key, value, options) => {
				event.cookies.set(key, value, { path: '/', ...options });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { path: '/', ...options });
			}
		}
	});

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			// supabase needs the content-range header
			return name === 'content-range';
		}
	});
};

const authorization: Handle = async ({ event, resolve }) => {
	const session = await event.locals.getSession()

	// GET requests
	if (event.url.pathname.startsWith('/dash') && event.request.method === 'GET') {
		if (!session) {
			throw redirect(303, '/');
		}
	}

	if (event.url.pathname.startsWith('/admin') && event.request.method === 'GET') {
		if (!session) {
			throw redirect(303, '/');
		}
	}

	// POST requests
	if (event.url.pathname.startsWith('/dash') && event.request.method === 'POST') {
		if (!session) {
			throw error(418, '/');
		}
	}

	return resolve(event)
}

export const handle = sequence(createSupabaseClient, authorization);