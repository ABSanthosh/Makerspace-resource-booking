import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { isAdmin } from '$lib/SupabaseUtils';
import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const createSupabaseClient: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
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
			return name === 'content-range';
		}
	});
};

const authorization: Handle = async ({ event, resolve }) => {
	const session = await event.locals.getSession();
	const userProfile = session
		? await isAdmin(event.locals.supabase, session.user.id)
		: {
				role: 'user',
				isNew: false
			};

	const isUserAdmin = userProfile.role === 'admin';
	const isUserNew = userProfile.isnew;

	// GET requests
	if (event.request.method === 'GET') {
		console.log('GET request');
		// if user not signed in and trying to access dashboard or admin page
		if (session) {
			// if user is admin and tries to go to dashboard, redirect to admin page
			if (event.url.pathname.startsWith('/dash') && isUserAdmin) {
				throw redirect(303, '/admin');
			} else if (
				event.url.pathname.includes('/dash') &&
				event.url.pathname !== '/dash' &&
				isUserNew
			) {
				throw redirect(303, '/dash');
			}

			// if user is new and tries to go to dashboard, redirect to onboarding page
			if (event.url.pathname.startsWith('/admin') && !isUserAdmin) {
				throw redirect(303, '/dash');
			}
		}
	}

	// POST requests
	if (event.url.pathname.startsWith('/dash') && event.request.method === 'POST') {
		if (!session) {
			throw error(418, '/');
		} else if (isUserAdmin) {
			throw error(418, '/admin');
		}
	}

	return resolve(event);
};

export const handle = sequence(createSupabaseClient, authorization);

// Ref:
// 1) https://github.com/fnimick/sveltekit-supabase-auth-starter/blob/main/src/hooks.server.ts
//
