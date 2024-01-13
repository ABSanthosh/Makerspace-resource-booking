import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { EZodSchema } from '$lib/schemas';
import { addEquipment, editEquipment, getAllEquipment, getECategories } from '$db/Equipment.db';
import { fail, type Actions } from '@sveltejs/kit';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
	const newEquipmentForm = await superValidate(EZodSchema);
	const editEquipmentForm = await superValidate(EZodSchema);
	const allEquipment = await getAllEquipment();
	const eCategories = await getECategories();
	if (Object.keys(locals).length === 0) return { newEquipmentForm };

	return {
		newEquipmentForm,
		editEquipmentForm,
		allEquipment,
		eCategories
	};
};

export const actions: Actions = {
	add: async ({ request }) => {
		const newEquipmentForm = await superValidate(request, EZodSchema);
		if (!newEquipmentForm.valid) {
			return fail(400, { newEquipmentForm });
		}
		
		return {
			form: {
				...newEquipmentForm,
				response: await addEquipment(newEquipmentForm.data),
				allEquipment: await getAllEquipment()
			}
		};
	},
	edit: async ({ request }) => {
		const editEquipmentForm = await superValidate(request, EZodSchema);
		if (!editEquipmentForm.valid) {
			return fail(400, { editEquipmentForm });
		}
		return {
			form: {
				...editEquipmentForm,
				response: await editEquipment(editEquipmentForm.data),
				allEquipment: await getAllEquipment()
			}
		};
	}
};
