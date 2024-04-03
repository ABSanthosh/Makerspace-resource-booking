import { cancelBooking, getUserBookings, updateBooking } from '$db/Cart.db';
import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { BookingCancelZSchema, BookingUpdateZSchema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
  return {
    bookingDeleteForm: await superValidate(zod(BookingCancelZSchema)),
    bookingUpdateForm: await superValidate(zod(BookingUpdateZSchema)),
    bookings: await getUserBookings(locals.session!.user.id)
  };
};

export const actions: Actions = {
  async cancel({ request }) {
    const bookingDeleteForm = await superValidate(request, zod(BookingCancelZSchema));
    if (!bookingDeleteForm.valid) {
      return fail(400, { bookingDeleteForm });
    }

    return {
      bookingDeleteForm,
      response: await cancelBooking(bookingDeleteForm.data.bookingId)
    };
  },
  async pay({ request }) {
    const bookingUpdateForm = await superValidate(request, zod(BookingUpdateZSchema));
    if (!bookingUpdateForm.valid) {
      return fail(400, { bookingUpdateForm });
    }

    return {
      bookingUpdateForm,
      response: await updateBooking({
        ...bookingUpdateForm.data,
        adminNotes: bookingUpdateForm.data.adminNotes || ''
      })
    };
  }
};
