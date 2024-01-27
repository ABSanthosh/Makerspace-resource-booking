import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';
import { createBrowserClient, parse } from '@supabase/ssr';
import { browser } from '$app/environment';

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

	return {
		supabase,
		session: data.session,
		pathname:
			decodeURIComponent(url.pathname)
				.split('/')
				.filter((key) => key !== '')[0] || ''
	};
};
