import { SupabaseEnum } from '$lib/Enums';
import { getStorageUrl } from '$lib/SupabaseUtils';
import { db } from '$lib/prisma';
import type { Events } from '@prisma/client';

export async function getAllEventsPreveiw(): Promise<Events[]> {
	// @ts-ignore
	return await db.events
		.findMany({
			select: {
				id: true,
				name: true,
				shortDescription: true,
				description: true,
				date: true,
				image: true,
				authorId: true,
				author: {
					select: {
						id: true,
						name: true
					}
				},
				createdAt: true,
				updatedAt: true,
				status: true
			}
		})
		.then((res) => {
			return res.map((item) => ({
				...item,
				image: getStorageUrl(SupabaseEnum.EVENTS, item.image)
			}));
		});
}

export async function getEventById(id: string): Promise<{
	id: string;
	name: string;
	shortDescription: string;
	description: string;
	date: Date;
	image: string;
	authorId: string;
	author: {
		id: string;
		name: string;
	};
	createdAt: Date;
	updatedAt: Date;
	status: string;
}> {
	// @ts-ignore
	return await db.events
		.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				name: true,
				shortDescription: true,
				description: true,
				date: true,
				image: true,
				authorId: true,
				author: {
					select: {
						id: true,
						name: true
					}
				},
				createdAt: true,
				updatedAt: true,
				status: true
			}
		})
		.then((item) => ({
			...item,
			image: getStorageUrl(SupabaseEnum.EVENTS, item.image)
		}));
}

export async function upsertEvent(event: Events) {
	return await db.events.upsert({
		where: {
			id: event.id
		},
		update: {
			name: event.name,
			shortDescription: event.shortDescription,
			description: event.description,
			date: event.date,
			image: event.image,
			authorId: event.authorId,
			status: event.status
		},
		create: {
			name: event.name,
			shortDescription: event.shortDescription,
			description: event.description,
			date: event.date,
			image: event.image,
			authorId: event.authorId,
			status: event.status
		}
	});
}
