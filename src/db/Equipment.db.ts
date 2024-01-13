import { db } from '$lib/prisma';
import type { ESchema } from '$lib/schemas';

export async function addEquipment(equipment: ESchema) {
	return await db.equipment.create({
		data: {
			name: equipment.name,
			model: equipment.model,
			image: equipment.image,
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

export async function getAllEquipment(): Promise<ESchema[]> {
	// @ts-ignore
	return await db.equipment.findMany({
		include: {
			instances: true
		}
	});
}

export async function editEquipment(equipment: ESchema) {
	return await db.equipment.update({
		where: {
			id: equipment.id
		},
		data: {
			name: equipment.name,
			model: equipment.model,
			image: equipment.image,
			description: equipment.description,
			instances: {
				updateMany: equipment.instances.map((item) => ({
					where: {
						id: item.id
					},
					data: {
						name: item.name,
						description: item.description,
						cost: item.cost,
						status: item.status
					}
				}))
			}
		}
	});
}

export async function getECategories() {
	return await db.eCategories.findMany();
}
