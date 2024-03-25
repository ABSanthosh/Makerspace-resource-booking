import { db } from '$lib/prisma';
import type { BookingSchema, CartItemSchema, UserProfileSchema } from '$lib/schemas';
import type { Booking, Prisma } from '@prisma/client';

export async function initCustomClaim(id: string) {
  return await db.$executeRawUnsafe(`
		UPDATE auth.users
		SET raw_app_meta_data = jsonb_set(
					COALESCE(raw_app_meta_data, '{}'::jsonb),
					'{custom_claims}',
					'{"role": "user", "isnew": true}',
					true
				) WHERE id = '${id}';
	`);
}

export async function getUserProfile(id: string) {
  return await db.profile.findUnique({
    where: { id }
  });
}

export async function updateUserProfile(profile: UserProfileSchema & { id: string }) {
  return await db.profile.update({
    where: { id: profile.id },
    data: {
      ...profile,
      isNew: false,
      // No freaking idea why this is needed
      typeData: profile.typeData ?? { null: null }
    }
  });
}

