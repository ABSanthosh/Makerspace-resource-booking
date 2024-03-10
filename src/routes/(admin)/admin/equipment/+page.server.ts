import nanoid from '$lib/nanoid';
import {
	ECategoryCRUDZSchema,
	EManualCRUDZSchema,
	EManualZSchema,
	EVideoCRUDZSchema,
	EVideoZSchema,
	EZodSchema
} from '$lib/schemas';
import { SupabaseEnum } from '$lib/Enums';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import {
	addEquipment,
	deleteECategories,
	toggleEquipment,
	editEquipment,
	getAllEquipment,
	getECategories,
	upsertECategories,
	addMultipleManuals,
	deleteManuals,
	addMultipleVideos,
	deleteVideos
} from '$db/Equipment.db';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
	const newEquipmentForm = await superValidate(zod(EZodSchema));
	if (Object.keys(locals).length === 0) return { newEquipmentForm };

	return {
		newEquipmentForm,
		editEquipmentForm: await superValidate(zod(EZodSchema)),
		allEquipment: await getAllEquipment(),
		eCategories: await getECategories(),
		categoryForm: await superValidate(zod(ECategoryCRUDZSchema)),
		manualForm: await superValidate(zod(EManualCRUDZSchema)),
		videoForm: await superValidate(zod(EVideoCRUDZSchema))
	};
};

export const actions: Actions = {
	add: async ({ request, locals: { supabase } }) => {
		const newEquipmentForm = await superValidate(request, zod(EZodSchema));
		const imageFile = newEquipmentForm.data.image as File;

		if (!newEquipmentForm.valid) {
			return fail(400, { newEquipmentForm });
		}
		const { data, error } = await supabase.storage
			.from(SupabaseEnum.EQUIPMENT)
			.upload(`${nanoid()}.${imageFile.name.split('.').pop()}`, imageFile);

		if (error) {
			return fail(400, { error });
		}

		return {
			form: {
				...newEquipmentForm,
				// Doc: Id will be filled in by the database
				response: await addEquipment({
					...newEquipmentForm.data,
					id: '',
					image: data.path,
					isDeleted: newEquipmentForm.data.isDeleted!
				}),
				allEquipment: await getAllEquipment()
			}
		};
	},
	edit: async ({ request, locals: { supabase } }) => {
		const editEquipmentForm = await superValidate(request, zod(EZodSchema));
		const imageFile = editEquipmentForm.data.image as File;

		if (imageFile.name || imageFile != undefined) {
			const { data, error } = await supabase.storage
				.from(SupabaseEnum.EQUIPMENT)
				.update(imageFile.name, editEquipmentForm.data.image, {
					upsert: true,
					cacheControl: '0'
				});
			if (error) {
				return fail(400, { error });
			}

			// Doc: When the image is updated, the cache is invalidated so the new image is shown.
			editEquipmentForm.data.image = data.path + '?cache=' + new Date().getTime();
		}

		if (!editEquipmentForm.valid) {
			return fail(400, { editEquipmentForm });
		}

		return {
			form: {
				...editEquipmentForm,
				response: await editEquipment({
					...editEquipmentForm.data,
					id: '',
					image: imageFile.name,
					isDeleted: editEquipmentForm.data.isDeleted!
				}),
				allEquipment: await getAllEquipment()
			}
		};
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		return {
			response: await toggleEquipment(id, true)
		};
	},
	enable: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		return {
			response: await toggleEquipment(id, false)
		};
	},
	categoryCRUD: async ({ request }) => {
		const categoryForm = await superValidate(request, zod(ECategoryCRUDZSchema));
		if (!categoryForm.valid) {
			return fail(400, { categoryForm });
		}

		if (
			categoryForm.data.add.length === 0 &&
			categoryForm.data.edit.length === 0 &&
			categoryForm.data.delete.length === 0
		) {
			return fail(400, { categoryForm });
		}

		return {
			form: {
				response: {
					upsert:
						categoryForm.data.add.length > 0 || categoryForm.data.edit.length > 0
							? await upsertECategories([...categoryForm.data.add, ...categoryForm.data.edit])
							: [],
					delete:
						categoryForm.data.delete.length > 0
							? await deleteECategories(categoryForm.data.delete)
							: []
				},
				eCategories: await getECategories()
			}
		};
	},
	manualCRUD: async ({ request, locals: { supabase } }) => {
		const manualForm = await superValidate(request, zod(EManualCRUDZSchema));
		if (!manualForm.valid) {
			return fail(400, { manualForm });
		}

		const addOperation = async () => {
			if (manualForm.data.add.length > 0) {
				for (const file of manualForm.data.add) {
					const { data, error } = await supabase.storage
						.from(SupabaseEnum.MANUAL)
						.upload(`${nanoid()}.pdf`, file.pdf as File);
					if (error) {
						return fail(400, { error });
					}
					file.pdf = data.path;
				}
				return await addMultipleManuals(
					manualForm.data.add.map((manual) => ({
						...manual,
						id: '',
						pdf: manual.pdf as string
					}))
				);
			} else {
				return { count: 0 };
			}
		};

		const deleteOperation = async () => {
			if (manualForm.data.delete.length > 0) {
				const { error } = await supabase.storage
					.from(SupabaseEnum.MANUAL)
					.remove(manualForm.data.delete);
				if (error) {
					return fail(400, { error });
				}
				return await deleteManuals(manualForm.data.delete);
			} else {
				return { count: 0 };
			}
		};

		return {
			form: manualForm,
			response: {
				add: await addOperation(),
				delete: await deleteOperation()
			}
		};
	},
	videoCRUD: async ({ request }) => {
		const videoForm = await superValidate(request, zod(EVideoCRUDZSchema));
		if (!videoForm.valid) {
			return fail(400, { videoForm });
		}

		return {
			form: videoForm,
			response: {
				add: videoForm.data.add.length > 0 ? await addMultipleVideos(videoForm.data.add) : [],
				delete: videoForm.data.delete.length > 0 ? await deleteVideos(videoForm.data.delete) : []
			}
		};
	}
};
