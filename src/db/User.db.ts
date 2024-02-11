import { db } from '$lib/prisma';
import type { CartItemSchema, UserProfileSchema } from '$lib/schemas';

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
			isNew: false
		}
	});
}

export async function addToCart(cardItem: CartItemSchema & { userId: string }) {
	await db.cart.upsert({
		where: {
			userId: cardItem.userId
		},
		update: {
			items: {
				create: [
					{
						equipmentId: cardItem.equipmentId,
						instanceId: cardItem.instanceId,
						start: cardItem.start,
						end: cardItem.end
					}
				]
			}
		},
		create: {
			userId: cardItem.userId,
			items: {
				create: [
					{
						equipmentId: cardItem.equipmentId,
						instanceId: cardItem.instanceId,
						start: cardItem.start,
						end: cardItem.end
					}
				]
			}
		}
	});
}
