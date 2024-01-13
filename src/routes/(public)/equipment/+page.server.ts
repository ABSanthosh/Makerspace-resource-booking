import { getAllEquipment } from '$db/Equipment.db.js';
import type { PageServerLoad } from './$types';

// @ts-ignore
export const load: PageServerLoad = async ({}) => {
	return {
		allEquipment: await getAllEquipment()
	};
};
