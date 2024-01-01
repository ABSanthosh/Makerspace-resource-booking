import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad, Actions } from './$types';
import { newEquipmentSchema } from '$lib/schemas';
import { fail, redirect } from '@sveltejs/kit';
import { addEquipment, getAllEquipment } from '$db/Equipment.db';

export const load: PageServerLoad = async ({ locals }) => {
	const newEquipmentForm = await superValidate(newEquipmentSchema);
	if (Object.keys(locals).length === 0) return { newEquipmentForm };

	return {
		newEquipmentForm
	};
};

export const actions: Actions = {
	add: async ({ request }) => {
		const newEquipmentForm = await superValidate(request, newEquipmentSchema);
		if (!newEquipmentForm.valid) {
			return fail(400, { newEquipmentForm });
		}
		return {
			form: {
				...newEquipmentForm,
				response: await addEquipment(newEquipmentForm.data),
				allEquipment: await getAllEquipment()
			},
		}
	}
};
