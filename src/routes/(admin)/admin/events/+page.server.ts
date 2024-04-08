import type { PageServerLoad } from './$types';
import { superValidate, withFiles } from 'sveltekit-superforms/server';
import { EventZodSchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, type Actions } from '@sveltejs/kit';
import { SupabaseEnum } from '$lib/Enums';

import { getAllEvents, upsertEvent } from '$db/Events.db';
import nanoid from '$lib/nanoid';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
	const upsertEventForm = await superValidate(zod(EventZodSchema));
	if (Object.keys(locals).length === 0) return { upsertEventForm, allEvents: [] };

	return {
		upsertEventForm,
		allEvents: await getAllEvents()
	};
};

export const actions: Actions = {
	upsertEvent: async ({ request, locals: { supabase, session } }) => {
		const upsertEventForm = await superValidate(request, zod(EventZodSchema));
		const imageFile = upsertEventForm.data.image as File;

		if (!upsertEventForm.valid) {
			return fail(400, withFiles({ upsertEventForm }));
		}

		if (typeof imageFile !== 'string') {
			if (upsertEventForm.data.id) {
				const { data, error } = await supabase.storage
				.from(SupabaseEnum.EVENT)
				.update(imageFile.name, imageFile, {
					upsert: true,
					cacheControl: '0'
				})
				
				if (error) {
					console.log('error', error);
					return fail(400, withFiles({ upsertEventForm, error }));
				} 

				upsertEventForm.data.image = data?.path ? data.path + '?cache=' + new Date().getTime() : '';;

				console.log("Updated", upsertEventForm.data.image);
			} else {
				const imageFile = upsertEventForm.data.image as File;
				const { data, error } = await supabase.storage
					.from(SupabaseEnum.EVENT)
					.upload(`${nanoid()}.${imageFile.name.split('.').pop()}`, imageFile);

				if (error) {
					return fail(400, withFiles({ upsertEventForm }));
				}

				upsertEventForm.data.image = data.path;
			}
		}

		return withFiles({
			upsertEventForm,
			response: await upsertEvent({
				...upsertEventForm.data,
				userId: session?.user.id!
			})
		});
	}
};