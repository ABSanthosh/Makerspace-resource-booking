import nanoid from '$lib/nanoid';
import { EZodSchema } from '$lib/schemas';
import { SupabaseEnum } from '$lib/Enums';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { addEquipment, editEquipment, getAllEquipment, getECategories } from '$db/Equipment.db';

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

		if (!newEquipmentForm.valid) {
			return fail(400, { newEquipmentForm });
		}
		if (
			!(formData.get('eImage') as File).name ||
			(formData.get('eImage') as File).name === 'undefined'
		) {
			return fail(400, {
				error: true,
				message: 'You must provide a file to upload'
			});
		}

		const { data, error } = await supabase.storage
			.from(SupabaseEnum.BUCKET)
			.upload(
				`${nanoid()}.${(formData.get('eImage') as File).name.split('.').pop()}`,
				formData.get('eImage') as File
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
	edit: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const editEquipmentForm = await superValidate(formData, EZodSchema);

		if (
			(formData.get('eImage') as File).name ||
			(formData.get('eImage') as File).name != 'undefined'
		) {
			console.log((formData.get('eImage') as File).name, editEquipmentForm.data);
			const { data, error } = await supabase.storage
				.from(SupabaseEnum.BUCKET)
				.update(editEquipmentForm.data.image as string, formData.get('eImage') as File, {
					upsert: true,
					cacheControl: '0'
				});
			console.log(editEquipmentForm.data.image as string, data, error);
			if (error) {
				return fail(400, { error });
			}

			editEquipmentForm.data.image = data.path;
		}

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
