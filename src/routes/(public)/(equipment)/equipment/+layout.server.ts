import { getAllEquipmentPreview, getECategories } from '$db/Equipment.db.js';
import type { LayoutServerLoad } from './$types';

// @ts-ignore
export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		categories: await getECategories(),
		allEquipment: await getAllEquipmentPreview(),
	};
};
