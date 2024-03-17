import { initCustomClaim } from '$db/User.db';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { getCustomClaim } from '$lib/SupabaseUtils';
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

	// Doc: This is the session data that gets trickled down to all parts of the app
	event.locals.session = await event.locals.getSession();
	if (
		event.locals.session?.user.app_metadata.provider !== undefined &&
		event.locals.session?.user.app_metadata.custom_claims === undefined
	) {
		await initCustomClaim(event.locals.session?.user.id);
		event.locals.supabase.auth.refreshSession();
		event.locals.session = await event.locals.getSession();
	}
	// console.log('session', event.locals.session?.user.app_metadata.custom_claims);
	// console.log('session', event.locals.session?.user.app_metadata.custom_claims);

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

const authorization: Handle = async ({ event, resolve }) => {
	const session = event.locals.session;

	if (!session && (event.url.pathname === '/dash' || event.url.pathname === '/admin')) {
		throw redirect(303, '/');
	}

	const isUserAdmin = getCustomClaim(session).role === 'admin';
	const isUserNew = getCustomClaim(session).isNew;

	// GET requests
	if (event.request.method === 'GET') {
		// if user not signed in and trying to access dashboard or admin page
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

	return resolve(event);
};

export const handle = sequence(createSupabaseClient, authorization);

// Ref:
// 1) https://github.com/fnimick/sveltekit-supabase-auth-starter/blob/main/src/hooks.server.ts
