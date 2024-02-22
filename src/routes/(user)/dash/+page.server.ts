import type { Actions, PageServerLoad } from './$types';
import { getUserProfile, updateUserProfile } from '$db/User.db';
import { UserProfileZodSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
	const userProfileForm = await superValidate(zod(UserProfileZodSchema));
	// console.log(userProfileForm);
	if (Object.keys(locals).length === 0) return { userProfileForm };

	// TODO: change to use v2 of superForms
	const dbUserProfile = await getUserProfile(locals.session?.user.id!);
	userProfileForm.data = {
		...userProfileForm.data,
		name: dbUserProfile?.name ?? '',
		email: dbUserProfile?.email ?? '',
		mobile: dbUserProfile?.mobile ?? '',
		branch: dbUserProfile?.branch ?? '',
		department: dbUserProfile?.department ?? '',
		year: dbUserProfile?.year ?? 0,
		isNew: dbUserProfile?.isNew!,
		role: dbUserProfile?.role!,
		userId: dbUserProfile?.userId ?? '',
		clubs: (dbUserProfile?.clubs as string[]) ?? []
	};

	return {
		userProfileForm,
		profileData: dbUserProfile
	};
};

export const actions: Actions = {
	update: async ({ request, locals: { session, supabase, getSession } }) => {
		const userProfileForm = await superValidate(request, zod(UserProfileZodSchema));

		if (!userProfileForm.valid) {
			return { userProfileForm };
		}

		const newProfileData = await updateUserProfile({
			...userProfileForm.data,
			isNew: false,
			id: session?.user.id!
		});

		// When the user updates their profile, we need to refresh the session
		if (userProfileForm.data.isNew !== newProfileData.isNew) {
			supabase.auth.refreshSession();
			session = await getSession();
		}
		return {
			userProfileForm,
			profileData: newProfileData
		};
	}
};
