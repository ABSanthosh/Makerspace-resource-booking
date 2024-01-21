import { db } from '$lib/prisma';
import type { CartItemSchema } from '$lib/schemas';

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
