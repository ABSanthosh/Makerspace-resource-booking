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
      isNew: false,
      // No freaking idea why this is needed
      typeData: profile.typeData ?? { null: null }
    }
  });
}

export async function addToCart(cardItem: CartItemSchema & { userId: string }) {
  /**
   * Doc: Start and end are converted from string of date object
   * to date object in the schema because for some reason, the
   * select tag isn't properly binding the value when its a date
   * object. So, we convert it to string and then back to date
   * object when we need to save it to the database.
   */
  await db.cart.upsert({
    where: {
      userId: cardItem.userId
    },
    update: {
      items: {
        create: [
          {
            instanceId: cardItem.instanceId,
            start: new Date(cardItem.start),
            end: new Date(cardItem.end)
          }
        ]
      }
    },
    create: {
      userId: cardItem.userId,
      items: {
        create: [
          {
            instanceId: cardItem.instanceId,
            start: new Date(cardItem.start),
            end: new Date(cardItem.end)
          }
        ]
      }
    }
  });
}

// getUserCart
export async function getUserCart(userId: string) {
  return await db.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          instance: {
            include: {
              equipment: true
            }
          }
        }
      }
    }
  });
}
