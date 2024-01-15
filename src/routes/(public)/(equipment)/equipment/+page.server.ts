import { getAllEquipment, getECategories } from '$db/Equipment.db.js';
import type { PageServerLoad } from './$types';

// @ts-ignore
export const load: PageServerLoad = async ({}) => {
	return {
		categories: await getECategories(),
		allEquipment: await getAllEquipment()
	};
};
