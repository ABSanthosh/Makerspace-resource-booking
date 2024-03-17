import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { CMSZSchema } from '$lib/schemas';
import { updateContentById } from '$db/CMS.db';

// @ts-ignore
export const load: PageServerLoad = async () => {
	return {
		contentForm: await superValidate(zod(CMSZSchema))
	};
};

export const actions: Actions = {
	update: async ({ request }) => {
		const contentForm = await superValidate(request, zod(CMSZSchema));
		return {
			form: contentForm,
			response: await updateContentById(contentForm.data.id, JSON.parse(contentForm.data.data))
		};
	}
};
