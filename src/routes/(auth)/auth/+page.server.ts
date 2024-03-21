import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  logout: async ({ locals: { supabase } }) => {
    console.log('logging out');
    await supabase.auth.signOut();
    throw redirect(303, '/');
  }
};
