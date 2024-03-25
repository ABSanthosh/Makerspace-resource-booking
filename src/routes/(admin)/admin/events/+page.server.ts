import type { PageServerLoad } from './$types';
import { superValidate, withFiles } from 'sveltekit-superforms/server';
import { EventZodSchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, type Actions } from '@sveltejs/kit';
import { SupabaseEnum } from '$lib/Enums';
import { nanoid } from 'nanoid';
import { getAllEventsPreveiw, upsertEvent } from '$db/Events.db';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
	const upsertEventForm = await superValidate(zod(EventZodSchema));
	if (Object.keys(locals).length === 0) return { upsertEventForm };

	return {
		upsertEventForm,
		allEvent: await getAllEventsPreveiw()
	};
};

export const actions: Actions = {
	upsertEvent: async ({ request, locals: { supabase } }) => {
		const upsertEventForm = await superValidate(request, zod(EventZodSchema));
		const imageFile = upsertEventForm.data.image as File;

		if (!upsertEventForm.valid) {
			return fail(400, withFiles({ upsertEventForm }));
		}

		if (typeof imageFile !== 'string') {
			if (upsertEventForm.data.id) {
				const { data, error } = await supabase.storage
					.from(SupabaseEnum.EVENTS)
					.update(imageFile.name, imageFile, {
						upsert: true,
						cacheControl: '0'
					});

				if (error) {
					console.log('error', error);
					return fail(400, withFiles({ upsertEventForm }));
				}

				// Doc: When the image is updated, the cache is invalidated so the new image is shown.
				upsertEventForm.data.image = data.path + '?cache=' + new Date().getTime();
			} else {
				const { data, error } = await supabase.storage
					.from(SupabaseEnum.EVENTS)
					.upload(`${nanoid()}.${imageFile.name.split('.').pop()}`, imageFile);
				if (error) {
					return fail(400, withFiles({ upsertEventForm }));
				}

				upsertEventForm.data.image = data.path;
			}
		}

		const { data: user } = await supabase.from('profile').select('id');

		return withFiles({
			upsertEventForm,
			response: await upsertEvent({
				...upsertEventForm.data,
				id: upsertEventForm.data.id || '',
				image: upsertEventForm.data.image as string,
				authorId: user ? user.toString() : '',
				status: false,
				createdAt: new Date(),
				updatedAt: new Date()
			}),
			allEvent: await getAllEventsPreveiw()
		});
	}
};
