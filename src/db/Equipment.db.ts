import { db } from "$lib/prisma";
import type { NewEquipmentSchema } from "$lib/schemas";

export async function addEquipment(equipment: NewEquipmentSchema) {
  return await db.equipment.create({
    data: {
      name: equipment.name,
      model: equipment.model,
      image: equipment.image,
      description: equipment.description,
      items: {
        create: equipment.equipment
      }
    }
  });
}

export async function getAllEquipment() {
  return await db.equipment.findMany({
    include: {
      items: true
    }
  });
}

export async function editEquipment(equipment: NewEquipmentSchema) {
  return await db.equipment.update({
    where: {
      id: equipment.id
    },
    data: {
      name: equipment.name,
      model: equipment.model,
      image: equipment.image,
      description: equipment.description,
      items: {
        updateMany: equipment.equipment.map((item) => ({
          where: {
            id: item.id
          },
          data: {
            name: item.name,
            description: item.description
          }
        }))
      }
    }
  });
}