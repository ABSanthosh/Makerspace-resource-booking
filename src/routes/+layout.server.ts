import { getAllContent } from '$db/CMS.db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		session: locals.session,
		content: await getAllContent()
	};
};
