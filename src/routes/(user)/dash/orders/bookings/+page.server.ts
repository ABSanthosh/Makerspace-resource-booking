import { getUserBookings } from "$db/User.db";
import type { PageServerLoad } from "./$types";

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
  return {
    bookings: await getUserBookings(locals.session!.user.id)
  };
};
