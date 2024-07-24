import { db } from '$lib/prisma';
import type { BookingSchema, CartItemSchema } from '$lib/schemas';
import { type Booking, type Prisma, PaymentStatus } from '@prisma/client';

export async function initUserCart(userId: string) {
  try {
    return await db.cart.create({
      data: {
        userId
      }
    });
  } catch (err) {
    return {
      error: 'Cart initialization failed. Please try again.'
    };
  }
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

export async function deleteCartItem(ids: string[]) {
  return await db.cartItem.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  });
}

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

export async function getUserBookings(userId: string) {
  return await db.booking.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          instance: true
        }
      }
    }
  });
}

export async function getAllBookings() {
  return await db.booking.findMany({
    include: {
      items: {
        include: {
          instance: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          mobile: true,
          email: true
        }
      }
    }
  });
}

export async function makeBooking(data: BookingSchema): Promise<
  | {
      booking: Booking;
      cart: Prisma.BatchPayload;
    }
  | {
      error: string;
    }
> {
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId: data.cartId,
      id: {
        in: data.instances
      }
    },
    select: {
      id: true,
      end: true,
      instanceId: true,
      start: true
    }
  });

  try {
    return await db.booking
      .create({
        data: {
          mentor: data.mentor,
          description: data.description,
          deadline: data.deadline,
          userId: data.userId,
          cost: data.cost,
          items: {
            create: cartItems.map((item) => ({
              end: item.end,
              start: item.start,
              instanceId: item.instanceId
            }))
          }
        }
      })
      .then(async (res) => {
        return {
          booking: res,
          cart: await db.cartItem.deleteMany({
            where: {
              id: {
                in: data.instances
              }
            }
          })
        };
      });
  } catch (err) {
    return {
      error: 'Booking failed. Please try again.'
    };
  }
}

export async function cancelBooking(bookingId: string) {
  return await db.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status: 'CANCELLED'
    }
  });
}

export async function updateBooking({
  bookingId,
  status,
  adminNotes,
  paymentId,
  paymentStatus
}: {
  bookingId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  adminNotes: string;
  paymentId?: string;
  paymentStatus?: PaymentStatus;
}) {
  return await db.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status,
      adminNotes,
      paymentId,
      paymentStatus
    }
  });
}
