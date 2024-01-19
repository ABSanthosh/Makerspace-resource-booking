import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { EZodSchema, type ESchema } from '$lib/schemas';
import { addEquipment, editEquipment, getAllEquipment, getECategories } from '$db/Equipment.db';
import { fail, type Actions } from '@sveltejs/kit';
import nanoid from '$lib/nanoid';
import { SupabaseEnum } from '$lib/Enums';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
	const newEquipmentForm = await superValidate(EZodSchema);
	if (Object.keys(locals).length === 0) return { newEquipmentForm };

	return {
		newEquipmentForm,
		editEquipmentForm: await superValidate(EZodSchema),
		allEquipment: await getAllEquipment(),
		eCategories: await getECategories()
	};
};

export const actions: Actions = {
	add: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const newEquipmentForm = await superValidate(formData, EZodSchema);

		if (
			!(formData.get('eImage') as File).name ||
			(formData.get('eImage') as File).name === 'undefined'
		) {
			return fail(400, {
				error: true,
				message: 'You must provide a file to upload'
			});
		}

		if (!newEquipmentForm.valid) {
			return fail(400, { newEquipmentForm });
		}

		const { data, error } = await supabase.storage
			.from(SupabaseEnum.BUCKET)
			.upload(
				`${nanoid()}.${(formData.get('eImage') as File).name.split('.').pop()}`,
				formData.get('eImage') as File,
				{
					cacheControl: '3600',
					upsert: false
				}
			);
		// console.log(data, error);

		if (error) {
			return fail(400, { error });
		}

		return {
			form: {
				...newEquipmentForm,
				response: await addEquipment({ ...newEquipmentForm.data, image: data.path }),
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
