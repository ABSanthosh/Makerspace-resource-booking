import { deleteCartItem, getUserCart, makeBooking } from '$db/User.db';
import { BookingZSchema, CartDeleteZSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
  const bookingForm = await superValidate(
    {
      userId: locals.session!.user.id,
    },
    zod(BookingZSchema),
    { errors: false }
  );
  const cartDeleteForm = await superValidate(zod(CartDeleteZSchema))

  return {
    bookingForm,
    cartDeleteForm,
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
  },
  delete: async ({ request }) => {
    const cartDeleteForm = await superValidate(request, zod(CartDeleteZSchema))
    if (!cartDeleteForm.valid) {
      return fail(400, { cartDeleteForm })
    }

    return {
      cartDeleteForm,
      response: await deleteCartItem(cartDeleteForm.data.ids)
    }
  }
}