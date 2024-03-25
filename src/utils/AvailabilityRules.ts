import type { EquipmentById } from '$lib/schemas';
import { BookingStatus, type BookingItem, type CartItem } from '@prisma/client';

interface ISlot {
  currentDay: Date | null;
  slotSize: number;
  instance: {
    start: string;
    end: string;
  };
  booked: EquipmentById['instances'][0]['BookingItem'][0][];
  carted: CartItem[];
}

interface IRange {
  [key: string]: Date;
}

export function getSlots(data: ISlot): IRange {
  const { currentDay, instance, booked, carted, slotSize = 30 } = data;

  const allSlots: { [key: string]: Date } = {};
  // Generate every slot of slotSize minutes between instance.start and instance.end for the current day
  if (currentDay) {
    const start = new Date(currentDay);
    start.setHours(
      Number(instance.start.split(':')[0]),
      Number(instance.start.split(':')[1]),
      0,
      0
    );
    const end = new Date(currentDay);
    end.setHours(Number(instance.end.split(':')[0]), Number(instance.end.split(':')[1]), 0, 0);

    for (let i = start.getTime(); i < end.getTime(); i += slotSize * 60000) {
      allSlots[
        new Date(i).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      ] = new Date(i);
    }
  } else {
    return {};
  }

  const bookedSlots: { [key: string]: Date } = {};
  // Generate all slotSize minutes slots from booked items if each item's start and end is the same as the current day
  booked.forEach((item) => {
    if (
      item.start.getDate() === currentDay!.getDate() &&
      item.end.getDate() === currentDay!.getDate()
    ) {
      for (let i = item.start.getTime(); i < item.end.getTime(); i += slotSize * 60000) {
        // Doc: If the booking is pending or approved, don't include the slot
        if ((item.booking.status === BookingStatus.APPROVED || item.booking.status === BookingStatus.PENDING)) {
          bookedSlots[
            new Date(i).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          ] = new Date(i);
        }
      }
    }
  });

  const cartedSlots: { [key: string]: Date } = {};
  // Generate all slotSize minutes slots from carted items if each item's start and end is the same as the current day
  carted.forEach((item) => {
    if (
      item.start.getDate() === currentDay!.getDate() &&
      item.end.getDate() === currentDay!.getDate()
    ) {
      for (let i = item.start.getTime(); i < item.end.getTime(); i += slotSize * 60000) {
        cartedSlots[
          new Date(i).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })
        ] = new Date(i);
      }
    }
  });

  // Remove booked and carted slots from all slots
  for (const key in bookedSlots) {
    delete allSlots[key];
  }

  for (const key in cartedSlots) {
    delete allSlots[key];
  }

  return allSlots;
}

interface ISelectSlots {
  selectedStartTime: string | null;
  selectedEndTime: string | null;
  slots: IRange;
}

export function getSelectionSlots(data: ISelectSlots): {
  startRange: IRange;
  endRange: IRange;
} {
  const { selectedStartTime, slots } = data;
  const selectedStartTimeDate = selectedStartTime ? new Date(selectedStartTime) : null;

  // if selectedStartTime is not null, remove all slots that are less than selectedStartTime
  const startRange: IRange = slots;
  const endRange: IRange = {};

  if (selectedStartTimeDate) {
    // end time should be greater than start time
    for (const key in slots) {
      if (slots[key].getTime() > selectedStartTimeDate.getTime()) {
        endRange[key] = slots[key];
      }
    }
  }

  return {
    startRange,
    endRange
  };
}
