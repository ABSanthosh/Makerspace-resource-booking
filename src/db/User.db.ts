import { db } from '$lib/prisma';
import type { CartItemSchema } from '$lib/schemas';
import { SessionStore } from '$store/SupaStore';
import { get } from 'svelte/store';

export async function isAdmin() {
	const uid = get(SessionStore)?.user?.id;
	console.log(uid);
	await db.$executeRawUnsafe(`select is_claims_admin();`);
}

export async function getClaim(claim: string) {
	await db.$executeRawUnsafe(`select get_my_claim('${claim}');`);
}

export async function getAllClaims() {
	const uid = get(SessionStore)?.user?.id;
	await db.$executeRawUnsafe(`select public.get_my_claims();`);
}

export async function setClaim(claim: string, value: string) {
	const uid = get(SessionStore)?.user?.id;
	await db.$executeRawUnsafe(`select set_claim('${uid}', '${claim}', '${value}');`);
}

export async function deleteClaim(claim: string) {
	const uid = get(SessionStore)?.user?.id;
	await db.$executeRawUnsafe(`select delete_claim('${uid}', '${claim}');`);
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
