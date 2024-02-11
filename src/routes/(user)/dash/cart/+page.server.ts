import { getUserCart } from '$db/User.db';
import { BookingZSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
	const bookingForm = await superValidate(BookingZSchema);
	return {
		bookingForm,
		cart: await getUserCart(locals.session!.user.id),
	};
};
 