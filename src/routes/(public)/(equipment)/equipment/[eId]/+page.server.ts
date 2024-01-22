import { getEquipmentById } from '$db/Equipment.db.js';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { CartItemZSchema } from '$lib/schemas';
import { fail, type Actions } from '@sveltejs/kit';
import { addToCart } from '$db/User.db';

// @ts-ignore
export const load: PageServerLoad = async ({ params }) => {
	return {
		equipment: await getEquipmentById(params.eId),
		cartItemForm: await superValidate(CartItemZSchema)
	};
};

export const actions: Actions = {
	add: async ({ request, locals: { supabase } }) => {
		const cartItemForm = await superValidate(request, CartItemZSchema);
		console.log(cartItemForm);

		if (!cartItemForm.valid) {
			return fail(400, { cartItemForm });
		}

		return {
			response: await addToCart({ ...cartItemForm.data, userId: cartItemForm.data.userId! })
		};
	}
};
