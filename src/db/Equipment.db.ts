import { getStorageUrl } from '$lib/SupabaseUtils';
import { db } from '$lib/prisma';
import type { ECategoriesSchema, EItemSchema } from '$lib/schemas';
import type { ECategories, Equipment } from '@prisma/client';

export async function addEquipment(equipment: Equipment & { instances: EItemSchema[] }) {
	return await db.equipment.create({
		data: {
			name: equipment.name,
			model: equipment.model,
			image: equipment.image as string,
			description: equipment.description,
			eCategoriesId: equipment.eCategoriesId,
			instances: {
				create: equipment.instances.map((item) => ({
					name: item.name,
					description: item.description!,
					status: item.status,
					cost: item.cost
				}))
			}
		}
	});
}

export async function getAllEquipmentPreview(): Promise<
	{ id: string; name: string; model: string; eCategoriesId: string; image: string }[]
> {
	// @ts-ignore
	return await db.equipment
		.findMany({
			select: {
				id: true,
				name: true,
				model: true,
				image: true,
				eCategoriesId: true
			}
		})
		.then((res) => {
			return res.map((item) => ({
				...item,
				image: getStorageUrl(item.image)
			}));
		});
}

export async function getAllEquipment(): Promise<
	(Equipment & { category: ECategories; instances: EItemSchema[] })[]
> {
	// @ts-ignore
	return await db.equipment.findMany({
		include: {
			instances: true,
			category: true
		}
	});
}

export async function getEquipmentById(
	id: string
): Promise<Equipment & { category: ECategories; instances: EItemSchema[] }> {
	// @ts-ignore
	return await db.equipment
		.findUnique({
			where: {
				id
			},
			include: {
				instances: true,
				category: true
			}
		})
		.then((res) => {
			return {
				...res,
				image: getStorageUrl(res!.image)
			};
		})
		.catch((err) => {
			error: err;
		});
}

export async function editEquipment(equipment: Equipment) {
	return await db.equipment.update({
		where: {
			id: equipment.id
		},
		data: {
			name: equipment.name,
			model: equipment.model,
			image: equipment.image,
			description: equipment.description,
			eCategoriesId: equipment.eCategoriesId
		}
	});
}

export async function getECategories() {
	return await db.eCategories.findMany();
}

export async function upsertECategories(categories: ECategoriesSchema[]) {
	return await db.$transaction(
		categories.map((category) =>
			db.eCategories.upsert({
				where: {
					id: category.id
				},
				update: {
					name: category.name
				},
				create: {
					name: category.name
				}
			})
		)
	);
}

export async function deleteECategories(ids: string[]) {
	return await db.eCategories.deleteMany({
		where: {
			id: {
				in: ids
			}
		}
	});
}
