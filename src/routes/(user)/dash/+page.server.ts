import { superValidate } from 'sveltekit-superforms/server';
import { UserProfileZodSchema } from '$lib/schemas';
import { getUserProfile, updateUserProfile } from '$db/User.db';
import type { Actions, PageServerLoad } from './$types';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
	const userProfileForm = await superValidate(UserProfileZodSchema);
	// console.log(userProfileForm);
	if (Object.keys(locals).length === 0) return { userProfileForm };

	const dbUserProfile = await getUserProfile(locals.session?.user.id!);
	userProfileForm.data = {
		...userProfileForm.data,
		name: dbUserProfile?.name ?? '',
		email: dbUserProfile?.email ?? '',
		mobile: dbUserProfile?.mobile ?? '',
		branch: dbUserProfile?.branch ?? '',
		department: dbUserProfile?.department ?? '',
		year: `${dbUserProfile?.year}` ?? '',
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
	// update
	update: async ({ request, locals: { session } }) => {
		const userProfileForm = await superValidate(request, UserProfileZodSchema);
		// console.log(userProfileForm);

		if (!userProfileForm.valid) {
			return { userProfileForm };
		}

		return {
			response: await updateUserProfile({
				...userProfileForm.data,
				isNew: false,
				id: session?.user.id!
			})
		};
	}
};
