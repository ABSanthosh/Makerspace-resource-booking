import { SupabaseEnum } from '$lib/Enums';
import { getStorageUrl } from '$lib/SupabaseUtils';
import { db } from '$lib/prisma';
import type { EventSchema } from '$lib/schemas';
import type { Event } from '@prisma/client';

export async function getAllEventsPreview() {
	return await db.event
		.findMany({
			select: {
				id: true,
				title: true,
				previewDesc: true,
				image: true,
				startTime: true,
				user: {
					select: {
						id: true,
						name: true
					}
				},
				status: true
			}
		})
		.then((res) => {
			return (
				res.map((item) => ({
					...item,
					image: getStorageUrl(SupabaseEnum.EVENT, item.image)
				})) || []
			);
		});
}

export async function getAllEvents() {
	return await db.event.findMany();
}

export async function getEventById(id: string) {
	return await db.event
		.findUnique({
			where: {
				id
			},
			include: {
				user: {
					select: {
						id: true,
						name: true
					}
				}
			}
		})
		.then((item) => {
			if (!item) return null;
			return {
				...item,
				image: getStorageUrl(SupabaseEnum.EVENT, item?.image)
			};
		});
}

export async function upsertEvent(event: EventSchema) {
	return await db.event.upsert({
		where: {
			id: event.id || '0'
		},
		update: {
			...event,
			image: event.image as string
		},
		create: {
			...event,
			image: event.image as string
		}
	});
}
// update: {
// 	name: event.name,
// 	shortDescription: event.shortDescription,
// 	description: event.description,
// 	date: event.date,
// 	image: event.image,
// 	authorId: event.authorId,
// 	status: event.status
// },
// create: {
// 	name: event.name,
// 	shortDescription: event.shortDescription,
// 	description: event.description,
// 	date: event.date,
// 	image: event.image,
// 	authorId: event.authorId,
// 	status: event.status
// }
