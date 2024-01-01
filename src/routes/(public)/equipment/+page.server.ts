import { getAllEquipment } from '$db/Equipment.db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({}) => {
	return {
		allEquipment: await getAllEquipment()
	};
};
