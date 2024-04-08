import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllUsers, setBlacklist } from '$db/User.db';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
  return {
    currentUserId: locals.session?.user.id,
    allUsers: await getAllUsers()
  };
};

export const actions: Actions = {
  async blacklist({ request }) {
    const formData = await request.formData();
    const id = formData.get('userId') as string;

    return {
      response: await setBlacklist(id, true)
    };
  },
  async unblacklist({ request }) {
    const formData = await request.formData();
    const id = formData.get('userId') as string;

    return {
      response: await setBlacklist(id, false)
    };
  }
};
