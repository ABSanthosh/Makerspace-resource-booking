import { getAllBookings, updateBooking } from '$db/Cart.db';
import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { BookingUpdateZSchema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';

// @ts-ignore
export const load: PageServerLoad = async () => {
  return {
    bookingUpdateForm: await superValidate(zod(BookingUpdateZSchema)),
    bookings: await getAllBookings()
  };
};

export const actions: Actions = {
  async update({ request }) {
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
