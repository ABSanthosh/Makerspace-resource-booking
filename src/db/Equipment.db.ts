import { SupabaseEnum } from '$lib/Enums';
import { getStorageUrl } from '$lib/SupabaseUtils';
import { db } from '$lib/prisma';
import type { ECategoriesSchema, EItemSchema, EquipmentById } from '$lib/schemas';
import { ESecondaryStatus, type BookingItem, type CartItem, type ECategories, type Equipment, type Manual, type Video, Prisma, type Booking } from '@prisma/client';

export async function getAllEquipmentPreview(): Promise<
  {
    id: string;
    name: string;
    model: string;
    image: string;
    secondaryStatus: ESecondaryStatus;
    eCategoriesId: string;
  }[]
> {
  // @ts-ignore
  return await db.equipment
    .findMany({
      select: {
        id: true,
        name: true,
        model: true,
        image: true,
        eCategoriesId: true,
        secondaryStatus: true
      }
    })
    .then((res) => {
      return res.map((item) => ({
        ...item,
        image: getStorageUrl(SupabaseEnum.EQUIPMENT, item.image)
      }));
    });
}

export async function getAllEquipment(): Promise<
  (Equipment & {
    manuals: Manual[];
    videos: Video[];
    category: ECategories;
    instances: EItemSchema[];
  })[]
> {
  // @ts-ignore
  return await db.equipment.findMany({
    include: {
      instances: true,
      category: true,
      manuals: true,
      videos: true
    }
  });
}

export async function getEquipmentById(id: string): Promise<EquipmentById> {
  // @ts-ignore
  return await db.equipment
    .findUnique({
      where: {
        id
      },
      include: {
        instances: {
          include: {
            CartItem: true,
            BookingItem: {
              include: {
                booking: {
                  select: {
                    status: true,
                  }
                }
              }
            }
          }
        },
        category: true,
        manuals: true,
        videos: true
      }
    })
    .then((res) => {
      return {
        ...res,
        image: getStorageUrl(SupabaseEnum.EQUIPMENT, res!.image)
      };
    })
    .catch((err) => ({
      error: err
    }));
}

export async function upsertEquipment(equipment: Equipment) {
  return await db.equipment.upsert({
    where: {
      id: equipment.id
    },
    update: {
      name: equipment.name,
      model: equipment.model,
      image: equipment.image,
      description: equipment.description,
      eCategoriesId: equipment.eCategoriesId
    },
    create: {
      name: equipment.name,
      model: equipment.model,
      image: equipment.image,
      description: equipment.description,
      eCategoriesId: equipment.eCategoriesId
    }
  });
}

export async function deleteEquipment(id: string) {
  return await db.equipment.delete({
    where: {
      id
    }
  });
}

export async function toggleEquipment(id: string, state: boolean) {
  // Doc: Mark as deleted so that we can keep the data for historical purposes i.e bookings
  return await db.$transaction([
    db.equipment.update({
      where: {
        id
      },
      data: {
        // isDeleted: state
        secondaryStatus: state ? ESecondaryStatus.ACTIVE : ESecondaryStatus.DELETED
      }
    }),
    db.eInstance.updateMany({
      where: {
        equipmentId: id
      },
      data: {
        secondaryStatus: state ? ESecondaryStatus.ACTIVE : ESecondaryStatus.DELETED
      }
    })
  ]);
}

export async function upsertInstance(instance: EItemSchema) {
  return await db.eInstance.upsert({
    where: {
      id: instance.id || '0'
    },
    update: {
      ...instance
    },
    create: {
      name: instance.name,
      cost: instance.cost,
      description: instance.description || '',
      availability: instance.availability,
      equipmentId: instance.equipmentId,
      status: instance.status
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

export async function addMultipleManuals(manuals: Manual[]) {
  // Doc: Since we are using Manual type from Prisma, we have to pass "id" but
  // we don't have to pass it to db since it's auto-generated. This means
  // a little bandwidth is saved.
  return await db.manual.createMany({
    data: manuals.map((manual) => ({
      name: manual.name,
      equipmentId: manual.equipmentId,
      pdf: manual.pdf
    }))
  });
}

export async function deleteManuals(ids: string[]) {
  return await db.manual.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  });
}

export async function addMultipleVideos(videos: Video[]) {
  return await db.video.createMany({
    data: videos
  });
}

export async function deleteVideos(ids: string[]) {
  return await db.video.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  });
}

