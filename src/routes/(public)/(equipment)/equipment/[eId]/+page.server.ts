import { getEquipmentById } from '$db/Equipment.db.js';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { CartItemZSchema } from '$lib/schemas';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { addToCart } from '$db/User.db';

// @ts-ignore
export const load: PageServerLoad = async ({ params }) => {
	const equipment = await getEquipmentById(params.eId);
	if (equipment === undefined) {
		throw redirect(307, '/equipment');
	}
	return {
		equipment,
		cartItemForm: await superValidate(CartItemZSchema)
	};
};

export const actions: Actions = {
	add: async ({ request, locals: { supabase } }) => {
		const cartItemForm = await superValidate(request, CartItemZSchema);

		if (!cartItemForm.valid) {
			return fail(400, { cartItemForm });
		}

		return {
			cartItemForm,
			response: await addToCart({ ...cartItemForm.data, userId: cartItemForm.data.userId! })
		};
	}
};
