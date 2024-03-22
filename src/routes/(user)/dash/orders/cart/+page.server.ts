import { getUserCart } from '$db/User.db';
import { BookingZSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { makeBooking } from '$db/Equipment.db';
import { fail } from '@sveltejs/kit';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
  const bookingForm = await superValidate(zod(BookingZSchema));

  return {
    bookingForm,
    cart: await getUserCart(locals.session!.user.id)
  };
};

export const actions: Actions = {
  book: async ({ request }) => {
    const bookingForm = await superValidate(request, zod(BookingZSchema));
    console.log(bookingForm);
    if (!bookingForm.valid) {
      return fail(400, { bookingForm });
    }

    const booking = await makeBooking(bookingForm.data)
    if ("error" in booking) {
      return fail(500, { bookingForm, error: booking.error })
    }

    return {
      bookingForm,
      booking
    }
  }
}