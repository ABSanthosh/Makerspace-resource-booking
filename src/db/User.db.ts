import { db } from '$lib/prisma';
import type { UserProfileSchema } from '$lib/schemas';
import type { UserRole } from '@prisma/client';

export async function initCustomClaim(id: string) {
  return await db.$executeRawUnsafe(`
		UPDATE auth.users
		SET raw_app_meta_data = jsonb_set(
					COALESCE(raw_app_meta_data, '{}'::jsonb),
					'{custom_claims}',
					'{"role": "user", "isnew": true, "is_blacklisted": false}',
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

// get all users
export async function getAllUsers() {
  return await db.profile.findMany();
}

export async function setBlacklist(id: string, blacklist: boolean) {
  return await db.$transaction([
    db.profile.update({
      where: { id },
      data: {
        isBlacklisted: blacklist
      }
    }),
    db.revalidateProfile.upsert({
      where: { userId: id },
      create: {
        userId: id
      },
      update: {}
    })
  ]);
}

export async function removeRevalidateProfile(id: string) {
  return await db.revalidateProfile.delete({
    where: { userId: id }
  });
}

export async function checkRevalidateProfile(id: string) {
  return await db.revalidateProfile.findUnique({
    where: { userId: id }
  });
}

export async function setUserRole(id: string, role: UserRole) {
  return await db.profile.update({
    where: { id },
    data: {
      role
    }
  });
}
