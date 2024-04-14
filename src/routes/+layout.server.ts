import { getAllContent } from '$db/CMS.db';
import { checkRevalidateProfile, removeRevalidateProfile } from '$db/User.db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (locals.session) {
    const isRevalidateUser = await checkRevalidateProfile(locals.session.user.id);
    if (isRevalidateUser) {
      locals.supabase.auth.refreshSession();
      locals.session = await locals.getSession();
      removeRevalidateProfile(locals.session?.user.id!);
    }
  }

  return {
    session: locals.session,
    content: await getAllContent()
  };
};
