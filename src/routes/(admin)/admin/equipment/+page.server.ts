import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad, Actions } from './$types';
import { newEquipmentSchema } from '$lib/schemas';
import { fail, redirect } from '@sveltejs/kit';
import { addEquipment, editEquipment, getAllEquipment } from '$db/Equipment.db';

export const load: PageServerLoad = async ({ locals }) => {
	const newEquipmentForm = await superValidate(newEquipmentSchema);
	const editEquipmentForm = await superValidate(newEquipmentSchema);
	const allEquipment = await getAllEquipment()
	if (Object.keys(locals).length === 0) return { newEquipmentForm };

	return {
		newEquipmentForm,
		editEquipmentForm,
		allEquipment
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
	},
	edit: async ({ request }) => {
		const editEquipmentForm = await superValidate(request, newEquipmentSchema);
		if (!editEquipmentForm.valid) {
			return fail(400, { editEquipmentForm });
		}
		return {
			form: {
				...editEquipmentForm,
				response: await editEquipment(editEquipmentForm.data),
				allEquipment: await getAllEquipment()
			},
		}
	},
};
