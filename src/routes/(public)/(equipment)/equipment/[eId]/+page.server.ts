import { getEquipmentById } from '$db/Equipment.db.js';
import type { PageServerLoad } from './$types';

// @ts-ignore
export const load: PageServerLoad = async ({ params }) => {
	return {
		equipment: await getEquipmentById(params.eId)
	};
};
