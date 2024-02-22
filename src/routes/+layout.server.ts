import { getContentByPathname } from '$db/CMS.db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	return {
		session: locals.session,
		content: await getContentByPathname(url.pathname)
	};
};