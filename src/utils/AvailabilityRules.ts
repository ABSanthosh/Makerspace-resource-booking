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

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  IN_CART = 'IN_CART'
}

interface IRange {
  [key: string]: {
    slot: Date;
    status: SlotStatus;
  };
}

interface ISlotCount {
  slotSize: number;
  start: Date;
  end: Date;
}

export function getNumberOfSlots(data: ISlotCount) {
  const { slotSize, start, end } = data;
  const startTime = new Date(start);
  const endTime = new Date(end);
  const slots: IRange = {};
  for (let i = startTime.getTime(); i < endTime.getTime(); i += slotSize * 60000) {
    slots[
      new Date(i).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    ] = {
      slot: new Date(i),
      status: SlotStatus.AVAILABLE
    };
  }

  return Object.keys(slots).length;
}

export function getSlots(data: ISlot): IRange {
  const { currentDay, instance, booked, carted, slotSize = 30 } = data;

  const allSlots: IRange = {};
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
      ] = {
        slot: new Date(i),
        status: SlotStatus.AVAILABLE
      };
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
        if (
          item.booking.status === BookingStatus.APPROVED ||
          item.booking.status === BookingStatus.PENDING
        ) {
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
    // delete allSlots[key];
    allSlots[key] = {
      slot: bookedSlots[key],
      status: SlotStatus.BOOKED
    };
  }

  for (const key in cartedSlots) {
    // delete allSlots[key];
    allSlots[key] = {
      slot: cartedSlots[key],
      status: SlotStatus.IN_CART
    };
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
  // selectedStartTime is a string is key of slots entry
  // Check if selectedStartTime is not null and selectedStartTime is a valid key in slots
  const selectedStartTimeDate =
    selectedStartTime && slots[selectedStartTime] && slots[selectedStartTime].slot
      ? new Date(slots[selectedStartTime].slot)
      : null;

  // if selectedStartTime is not null, remove all slots that are less than selectedStartTime
  const availableSlotSets: IRange[] = Object.keys(slots)
    .reduce(
      (acc: IRange[], key) => {
        if (slots[key].status === SlotStatus.AVAILABLE) {
          acc[acc.length - 1][key] = slots[key];
        } else {
          acc.push({});
        }
        return acc;
      },
      [{}]
    )
    .filter((set) => Object.keys(set).length > 0);

  // availableSlotSets is in the format [ {a: "a", b: "b"}, {c: "c", d: "d"}]
  // We need to merge all the objects in the array to get the startRange
  const startRange: IRange =
    availableSlotSets.length > 0
      ? availableSlotSets
          .filter((set) => Object.keys(set).length > 1)
          .reduce((acc, curr) => {
            return { ...acc, ...curr };
          }, {})
      : slots;

  const endRange: IRange = {};

  if (selectedStartTimeDate) {
    // We need to select the slot set that contains the selectedStartTime
    // so that we can get all the slots that are greater than selectedStartTime
    let selectedSlotSet: IRange = availableSlotSets.filter((set) => {
      return Object.keys(set).includes(selectedStartTime!);
    })[0];

    // end time should be greater than start time
    for (const key in selectedSlotSet) {
      if (slots[key].slot.getTime() > selectedStartTimeDate.getTime()) {
        endRange[key] = slots[key];
      }
    }
  }

  return {
    startRange,
    endRange
  };
}
