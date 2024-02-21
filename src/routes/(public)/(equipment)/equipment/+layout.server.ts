import { getAllEquipmentPreview, getECategories } from '$db/Equipment.db.js';
import type { LayoutServerLoad } from './$types';

// @ts-ignore
export const load: LayoutServerLoad = async () => {
	return {
		categories: await getECategories(),
		allEquipment: await getAllEquipmentPreview()
	};
};
