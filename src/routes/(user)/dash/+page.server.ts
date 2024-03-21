import type { Actions, PageServerLoad } from './$types';
import { getUserProfile, updateUserProfile } from '$db/User.db';
import { UserProfileZodSchema, type UserProfileSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
  let userProfileForm = await superValidate(zod(UserProfileZodSchema));
  if (Object.keys(locals).length === 0) return { userProfileForm };
  const dbUserProfile = await getUserProfile(locals.session?.user.id!);
  userProfileForm = await superValidate(
    {
      name: dbUserProfile?.name,
      email: dbUserProfile?.email,
      mobile: dbUserProfile?.mobile || '',
      isNew: dbUserProfile?.isNew,
      role: dbUserProfile?.role,
      type: dbUserProfile?.type as UserProfileSchema['type'],
      typeData: dbUserProfile?.typeData! as UserProfileSchema['typeData']
    } as UserProfileSchema,
    zod(UserProfileZodSchema),
    { errors: false }
  );

  return {
    userProfileForm,
    profileData: dbUserProfile
  };
};

export const actions: Actions = {
  update: async ({ request, locals: { session, supabase, getSession } }) => {
    let userProfileForm = await superValidate(request, zod(UserProfileZodSchema));
    if (!userProfileForm.valid) {
      return { userProfileForm };
    }

    const newProfileData = await updateUserProfile({
      ...userProfileForm.data,
      isNew: false,
      id: session?.user.id!
    });

    /**
     * Doc: When the user updates their profile, we need to refresh the session
     * so that the custom claims are updated
     */
    if (userProfileForm.data.isNew !== newProfileData.isNew) {
      supabase.auth.refreshSession();
      session = await getSession();
    }

    userProfileForm = await superValidate(
      {
        name: newProfileData.name,
        email: newProfileData.email,
        mobile: newProfileData.mobile || '',
        isNew: newProfileData.isNew,
        role: newProfileData.role,
        type: newProfileData.type,
        typeData: newProfileData.typeData
      } as UserProfileSchema,
      zod(UserProfileZodSchema),
      { errors: false }
    );

    return {
      userProfileForm,
      profileData: newProfileData
    };
  }
};
