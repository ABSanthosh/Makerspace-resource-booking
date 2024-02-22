import { getAllContent } from '$db/CMS.db';
import type { LayoutServerLoad } from './$types';

// @ts-ignore
export const load: LayoutServerLoad = async ({ url }) => {
	return {
		content: await getAllContent(),
		pathParam: url.searchParams.get('path')
	};
};
