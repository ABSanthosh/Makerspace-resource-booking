import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';
import { createBrowserClient, parse } from '@supabase/ssr';
import { browser } from '$app/environment';
import { getUserProfile } from '$lib/userUtils';
import { redirect } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ fetch, data, depends, url }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: { fetch },
		cookies: {
			get(key) {
				if (!browser) return JSON.stringify(data.session);
				return parse(document.cookie)[key];
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	// If there is no session, redirect to the index page.
	// This works because in the client, on sign out, we remove the session cookie and
	// invalidate is called. This will make the layout.ts load function run again.
	// if (session === null && url.pathname !== '/') {
	// 	throw redirect(303, '/');
	// }

	const profile = session ? await getUserProfile(supabase, session?.user?.id!) : null;

	return {
		supabase,
		session,
		profile,
		pathname:
			decodeURIComponent(url.pathname)
				.split('/')
				.filter((key) => key !== '')[0] || ''
	};
};
